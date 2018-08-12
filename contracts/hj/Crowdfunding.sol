pragma solidity ^0.4.23;

import "./CrowdfundingBase.sol";
import "./CrowdfundingToken.sol";
import "./RefundVault.sol";

/**
 * @title Crowdfunding
 */
contract Crowdfunding is Ownable, CrowdfundingBase {
    using SafeMath for uint256;
    using SafeERC20 for ERC20;
    
    ERC20 public token;
    RefundVault public vault;

    struct Funder {
        address addr;
        uint256 amount;
    }

    Funder[] public funders;

    // 투자자가 wei당 얻는 토큰 단위 수
    uint256 constant rate = 1;
    // 모금 된 양
    uint256 public weiRaised;
    // 모금해야할 목표금액(wei)
    uint256 public goal;
    uint256 public openingTime;
    uint256 public closingTime;

    bool public isFinalized = false;
    bool public isPaused = false;

    event TokenPurchase(
        address indexed purchaser,
        address indexed beneficiary,
        uint256 value,
        uint256 amount
    );
    event GoalReached(address vault, uint256 weiRaised);
    event Pause();
    event Unpause();
    event Finalized();

    constructor(
        address _wallet, 
        string _name, 
        string _symbol, 
        uint256 _goal, 
        uint256 _openingTime,
        uint256 _closingTime
    )
        public
        Ownable()
    {
        goal = _goal * 1 ether;
        openingTime = _openingTime;
        closingTime = _closingTime;
        token = new CrowdfundingToken(this, _name, _symbol);
        vault = new RefundVault(_wallet);
    }
    
    modifier onlyWhileOpen {
        // solium-disable-next-line security/no-block-members
        require(block.timestamp >= openingTime && block.timestamp <= closingTime, "It has not started yet.");
        _;
    }

    modifier whenNotPaused() {
        require(!isPaused);
        _;
    }

    modifier whenPaused() {
        require(isPaused);
        _;
    }

    function () external payable {
        buyTokens(msg.sender);
    }

    function buyTokens(address _beneficiary) public payable {
        uint256 amount = msg.value;

        _preValidatePurchase(_beneficiary, amount);

        uint256 tokens = _getTokenAmount(amount);
        weiRaised = weiRaised.add(amount);

        _processPurchase(_beneficiary, tokens);
        
        emit TokenPurchase(
            msg.sender,
            _beneficiary,
            amount,
            tokens
        );

        _forwardFunds();
        
        _checkGoalReached();
    }

    /**
    * @dev 토큰 구매 유효성 검사
    * @param _beneficiary 투자자 주소
    * @param _weiAmount 구매 wei값
    */
    function _preValidatePurchase(
        address _beneficiary,
        uint256 _weiAmount
    )
        internal
        view
        onlyWhileOpen
    {
        require(_beneficiary != address(0));
        require(_weiAmount != 0);
        require(weiRaised.add(_weiAmount) <= goal);
    }
    
    function _checkGoalReached() internal returns(bool) {
        if (goalReached()) {
            closingTime = now;
            emit GoalReached(vault, weiRaised);
        }
    }

    function _processPurchase(
        address _beneficiary,
        uint256 _tokenAmount
    )
        internal
    {
        _deliverTokens(_beneficiary, _tokenAmount);
    }
    
    function _deliverTokens(
        address _beneficiary,
        uint256 _tokenAmount
    )
        internal
    {
        require(MintableToken(token).mint(_beneficiary, _tokenAmount));
    }
    
    function _forwardFunds() internal {
        vault.deposit.value(msg.value)(msg.sender);
        
    }

    function _updatePurchasingState(
        address _beneficiary,
        uint256 _amount
    )
        internal
    {
        funders[funders.length++] = Funder({addr: _beneficiary, amount: _amount});
    }

    function _getTokenAmount(uint256 _weiAmount) 
        internal pure returns (uint256)
    {
        return _weiAmount.mul(rate);
    }

    function hasClosed() public view returns (bool) {
        // solium-disable-next-line security/no-block-members
        return block.timestamp > closingTime;
    }

    /**
    * @dev crowdfunding이 실패한 경우 투자자가 환불을 청구 할 수 있습니다.
    */
    function claimRefund() public {
        require(isFinalized);
        require(!goalReached());

        vault.refund(msg.sender);
    }

    /**
    * @dev 자금 조달 목표에 도달했는지 확인합니다.
    * @return 기금 목표에 도달했는지의 여부
    */
    function goalReached() public view returns (bool) {
        return weiRaised >= goal;
    }

  
    function emergencyPause() onlyOwner public whenNotPaused {
        isPaused = true;
        
        emit Pause();
    }

    function finalize() onlyOwner public {
        require(!isFinalized);
        require(hasClosed());
        
        isFinalized = true;
        
        finalization();
        emit Finalized();
    }

    function finalization() internal {
        if (goalReached()) {
            vault.close();
        } else {
            vault.enableRefunds();
        }
    }

}

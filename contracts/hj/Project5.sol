pragma solidity ^0.4.23;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Crowdfunding.sol";

contract Project5 is Ownable, CrowdfundingBase {
    
    struct Campaign {
        address addr;
        address wallet;
        address token;
        string name;
        string symbol;
        uint32 goal;
        uint64 openingTime;
        uint64 closingTIme;
        uint256 weiRaised;
        State state;
    }

    address[] public campaigns;
    mapping (address => Campaign) public campaignToMapping;

    event NewCrowdfunding();
    
    constructor() public Ownable() {
        require(msg.sender != address(0));
    }
    
    /**
    * @dev 크라우드 펀딩을 등록합니다.
    * @param _wallet 크라우드 펀딩 지갑 주소
    * @param _name 토큰 이름
    * @param _symbol 토큰 심볼
    * @param _goal 목표 모금액
    * @param _openingTime 시작시간
    * @param _closingTIme 종료시간
    */
    function newCrowdfunding (
        address _wallet, 
        string _name, 
        string _symbol,
        uint32 _goal,
        uint64 _openingTime, 
        uint64 _closingTime
    ) 
        public
        onlyOwner
    {
        require(_wallet != address(0));
        require(_goal > 0);
        require(_openingTime >= block.timestamp);
        require(_closingTime >= _openingTime);

        Crowdfunding cf= new Crowdfunding(_wallet, _name, _symbol, _goal, _openingTime, _closingTime);
        
        Campaign memory campaign = Campaign({
            addr: cf,
            wallet: _wallet,
            token: cf.token(),
            name: _name,
            symbol: _symbol,
            goal: _goal,
            openingTime: _openingTime,
            closingTIme: _closingTime,
            weiRaised: 0,
            state: State.Ready
        });
        
        _saveCrowdfunding(campaign);
        
        emit NewCrowdfunding();
    }
    
    function _saveCrowdfunding(Campaign _campaign) internal {
        campaigns.push(_campaign.addr);
        campaignToMapping[_campaign.addr] = _campaign;
    }
    
    /**
    * @dev 모든 크라우드 펀딩 목록을 반환합니다.
    * @return address[]
    */
    function getCrowdfundings() public view returns (address[]) {
        return campaigns;
    }
    
    /**
    * @dev 크라우드 펀딩을 반환합니다.
    * @param _crowdfunding 크라우드 펀딩 주소
    * @return Campaign
    */
    function getCrowdfunding(address _crowdfunding) public view returns (
        address addr,
        address wallet,
        address token,
        string name,
        string symbol,
        uint256 goal,
        uint256 weiRaised,
        uint256 openingTime,
        uint256 closingTIme
    ) 
    {
        Campaign storage campaign = campaignToMapping[_crowdfunding];
        
        return(
            campaign.addr, 
            campaign.wallet, 
            campaign.token, 
            campaign.name,
            campaign.symbol, 
            campaign.goal, 
            campaign.weiRaised, 
            campaign.openingTime, 
            campaign.closingTIme
        );
    }
    
    /**
    * @dev 크라우드 펀딩을 비상 중지시킵니다.
    * @param _crowdfunding 크라우드 펀딩 주소
    */
    function emergenyPauseCrowdfunding(address _crowdfunding) public onlyOwner {
        Campaign storage campaign = campaignToMapping[_crowdfunding];
        campaign.state = State.Paused;
        
        require(_crowdfunding.call(bytes4(keccak256("emergencyPause()"))));
    }
    
    /**
    * @dev 크라우드 펀딩을 종료시킵니다.
    * @param _crowdfunding 크라우드 펀딩 주소
    */
    function finalizeCrowdfunding(address _crowdfunding) public onlyOwner {
        Campaign storage campaign = campaignToMapping[_crowdfunding];
        campaign.state = State.Closed;
        
        require(_crowdfunding.call(bytes4(keccak256("finalize()"))));
    }

}

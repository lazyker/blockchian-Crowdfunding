pragma solidity ^0.4.24;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./P5Token.sol";
import "./ContractList.sol";


contract Crowdsale is Ownable{
    
    using SafeMath for uint256;
    
    uint256 public fundingGoal; 
    uint256 public price;
    uint256 public totalTransferableToken;
    uint256 public soldToken;
    P5Token public tokenUsed;
    bool public fundingGoalOk;
    bool public isOpened;
    ContractList public contracts;
    
    mapping(address => Property) public fundersProperty;
    
    struct Property {
        uint256 payEther;
        uint256 reservedToken;
        bool withdrawed;
    }
    
    event CrowdsaleStart(uint fundingGoal, uint totalTransferableToken, address beneficiary);
    event ReservedToken(address beneficiary, uint amount, uint token);
    event IsGoalReached(address beneficiary, uint fundingGoal, uint amountRaised, bool reached, uint raisedToken);
    event WithdrawalToken(address addr, uint amount, bool result);
    event WithdrawalEther(address addr, uint amount, bool result);
    
    constructor(
        uint256 _initSupply,
        string _name,
        string _symbol,
        uint8 _decimals,     
        uint _fundingGoalInEthers, 
        uint _totalTransferableToken,
        uint _amountTokenPerEther,
        ContractList _contracts
        //P5Token _token
    ){
        fundingGoal = _fundingGoalInEthers * 1 ether;
        price = 1 ether / _amountTokenPerEther;
        totalTransferableToken = _totalTransferableToken;
        //token = P5Token(_token);
        tokenUsed = new P5Token(_initSupply,_name,_symbol,_decimals);
        contracts = ContractList(_contracts);
        contracts.inputList(address(this));
    }
    
    function () payable{
        require(isOpened);
        
        uint amount = msg.value;
        uint token = (amount / price);
        
        if(token == 0 || soldToken + token > totalTransferableToken) revert();
        
        fundersProperty[msg.sender].payEther += amount;
        fundersProperty[msg.sender].reservedToken += token;
        soldToken += token;
        emit ReservedToken(msg.sender, amount, token);
    }
    
    function start() onlyOwner{
        if(fundingGoal == 0 || price == 0 || totalTransferableToken == 0 || tokenUsed == address(0)) revert();
        
        if(tokenUsed.balanceOf(this) >= totalTransferableToken){
            isOpened = true;
            emit CrowdsaleStart(fundingGoal, totalTransferableToken, owner);
        }
    }
    
    function getRemainingEthToken() public view returns(uint shortage, uint remainToken){
        shortage = (fundingGoal.sub(this.balance)) / 1 ether;
        remainToken = totalTransferableToken - soldToken;
    } 
    
    function checkGoalReached(){
        require(isOpened);
        
        if(this.balance >= fundingGoal){
            fundingGoalOk = true;
        }
        
        isOpened = false;
        emit IsGoalReached(owner, fundingGoal, this.balance, fundingGoalOk, soldToken);
    }
    
    function withdrawalOwner() onlyOwner {
       // if(isOpened) revert();
        
        if(fundingGoalOk){
            uint amount = this.balance;
            if(amount > 0){
                bool ok = msg.sender.call.value(amount)();
                emit WithdrawalEther(msg.sender, amount, ok);
            }
            
            uint val = totalTransferableToken - soldToken;
            
            if(val > 0){
                tokenUsed.transfer(msg.sender, totalTransferableToken - soldToken);
                emit WithdrawalToken(msg.sender,val,true); 
            }
        }else{
            uint val2 = tokenUsed.balanceOf(this);
            tokenUsed.transfer(msg.sender, val2);
            emit WithdrawalToken(msg.sender, val2, true);
        }
    }
    
    function withdrawal(){
        if(isOpened) revert();
        
        if(fundersProperty[msg.sender].withdrawed) revert();
        
        if(fundingGoalOk){
            if(fundersProperty[msg.sender].reservedToken > 0){
                tokenUsed.transfer(msg.sender, fundersProperty[msg.sender].reservedToken);
                fundersProperty[msg.sender].withdrawed = true;
                emit WithdrawalToken(
                    msg.sender,
                    fundersProperty[msg.sender].reservedToken,
                    fundersProperty[msg.sender].withdrawed
                );
            }
        }else{
            if(fundersProperty[msg.sender].payEther > 0){
                if(msg.sender.call.value(fundersProperty[msg.sender].payEther)()){
                    fundersProperty[msg.sender].withdrawed = true;
                }
                
                emit WithdrawalEther(
                    msg.sender,
                    fundersProperty[msg.sender].payEther,
                    fundersProperty[msg.sender].withdrawed
                );
            }
        }
    }
}
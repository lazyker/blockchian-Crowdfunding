pragma solidity ^0.4.23;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Crowdfunding.sol";

contract Project5 is Ownable {
    
    enum State { Ready, Active, Refunding, Closed }

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
    mapping (uint256 => Campaign) public campaignToMapping;

    event NewCrowdfunding();
    
    constructor() public Ownable() {
        require(msg.sender != address(0));
    }
    
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
        uint256 id = campaigns.push(_campaign.addr) - 1;
        campaignToMapping[id] = _campaign;
    }
    
    function getCrowdfundings() public view returns (address[]) {
        return campaigns;
    }
    
    function getCrowdfunding(uint256 _id) public view returns (
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
        Campaign storage campaign = campaignToMapping[_id];
        
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
    
    function finalizeCrowdfunding(address _crowdfunding) public onlyOwner {
        require(_crowdfunding.call(bytes4(keccak256("finalize()"))));
    }
    
}
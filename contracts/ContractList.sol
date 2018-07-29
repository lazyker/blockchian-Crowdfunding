pragma solidity ^0.4.24;

contract ContractList {
    
    address[] public contracts;
    
    function getList() public view returns(address[]) {
        return contracts;
    }
    
    function inputList(address _crowdSale) public {
        
        require(_crowdSale != address(0));
        
        contracts.push(_crowdSale);
    }
}
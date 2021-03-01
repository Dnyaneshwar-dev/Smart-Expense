pragma solidity >=0.4.22 <0.9.0;
contract smartexpense
{
    uint public total = 0; 
    uint public taskCount = 0;
    struct Task{
        uint id;
        uint cost;
        string details;       
    }

    mapping(uint => Task) public tasks;

    
    function createTask(uint _cost,string memory _details) public{
        taskCount++;
        total = total + _cost;
        tasks[taskCount] = Task(taskCount,_cost,_details);

    }

    


}
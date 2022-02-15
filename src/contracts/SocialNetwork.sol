//Declares solidity programming language
pragma solidity ^0.5.0;

// We create a smart contract with the contract keyword
contract SocialNetwork {
    // State variable that will represent the name of our smart contract,
    //This state variable value will get stored directly to the blockchain itself, unlike a local variable which will not.
    string public name;
    // Create a counter cache to generate posts ids
    uint256 public postCount = 0;
    // create a way to store new posts on the blockchain. We'll use a Solidity mapping to do this:
    // This mapping will uses key-value pairs to store posts, where the key is an id, and the value is a post struct
    mapping(uint256 => Post) public posts;

    struct Post {
        uint256 id;
        string content;
        uint256 tipAmount;
        address payable author;
    }

    // Now lets trigger an event whenever the post is created. Solidity allows us to create events that external consumers can subscribe to
    event PostCreated(
        uint256 id,
        string content,
        uint256 tipAmount,
        address payable author
    );

    // An event that gets triggered anytime a new tip is created
    event PostTipped(
        uint256 id,
        string content,
        uint256 tipAmount,
        address payable author
    );

    // Constructor function, which is a special function that get called only once whenever the smark contract is created
    constructor() public {
        name = "Dapp University Social Network";
    }

    function createPost(string memory _content) public {
        // Require valid content
        require(bytes(_content).length > 0);
        // Increment the post count
        postCount++;
        // Create the post
        posts[postCount] = Post(postCount, _content, 0, msg.sender);
        // Trigger event
        emit PostCreated(postCount, _content, 0, msg.sender);
    }

    // Tipping Functionality
    // function that allows other users to tip posts with cryptocurrency:
    function tipPost(uint256 _id) public payable {
        // Add a validation that the post exists
        // Make sure the id is valid
        require(_id > 0 && _id <= postCount);
        // Fetch the Post ....from the blockchain and store a new copy in memory.
        Post memory _post = posts[_id];
        // Fetch the author ...store the post author to a variable
        address payable _author = _post.author;
        // Pay the author by sending them Ether using the transfer function. Solidity allows us to read the crtprocurrency value with the special msg.value variable
        address(_author).transfer(msg.value);
        // Increment the tip amount for the post
        _post.tipAmount = _post.tipAmount + msg.value;
        // Update the post (we save the updated post values by adding it back to the mapping and storing it on the blockchain)
        posts[_id] = _post;
        // Now we trigger the event we created above
        emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
    }
}

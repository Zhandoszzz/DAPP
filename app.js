let contract;
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else {
        console.error('No Ethereum provider detected');
    }

    const contractAddress = '0xffd1E4861ed1D1814dE7a3bA33C2691D331C83E1'; // Replace with your actual contract address
    const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "friend_key",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                }
            ],
            "name": "addFriend",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "pubkey",
                    "type": "address"
                }
            ],
            "name": "checkUserExists",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                }
            ],
            "name": "createAccount",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getAllAppUser",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "accountAddress",
                            "type": "address"
                        }
                    ],
                    "internalType": "struct ChatApp.AllUserStruct[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getFriends",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "pubkey",
                            "type": "address"
                        }
                    ],
                    "internalType": "struct ChatApp.friend[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "pubkey",
                    "type": "address"
                }
            ],
            "name": "getUsername",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "friend_key",
                    "type": "address"
                }
            ],
            "name": "readMessage",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "sender",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "msg",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct ChatApp.message[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "friend_key",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "_msg",
                    "type": "string"
                }
            ],
            "name": "sendMessage",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    contract = new web3.eth.Contract(contractABI, contractAddress);

    // Function to display all existing users
    function displayAllUsers() {
        contract.methods.getAllAppUser().call((error, result) => {
            if (!error) {
                const allUsersElement = document.getElementById('allUsers');
                result.forEach((user, index) => {
                    const { name, accountAddress } = user;
                    const userInfoElement = document.createElement('div');
                    userInfoElement.innerHTML = `
            <h2>User ${index + 1}</h2>
            <p>Name: ${name}</p>
            <p>Address: ${accountAddress}</p>
            <hr>
          `;
                    allUsersElement.appendChild(userInfoElement);
                });
            } else {
                console.error('Error fetching users:', error);
            }
        });
    }

    displayAllUsers();


});
async function createUser() {

    try {
        
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        const name = document.querySelector('#nameInput').value

        console.log(name, account)
        // Call the contract's createAccount function to create a new user
        const tx = await contract.methods.createAccount(name).send({
            from: account,
        });

        // Transaction successful
        console.log('User created:', tx);
        alert('User created successfully!');

    } catch (error) {
        // Handle errors
        console.error('Error creating user:', error);
        alert('Error creating user. Please check the console.');
    }
}

function redirectToMainPage() {
    window.location.href = 'chat.html';
}
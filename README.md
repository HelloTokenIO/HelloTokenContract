# Project

## HelloToken

# Main Token that fuels the HelloNet protocol
	- Transferrable
	- Burnable
	- Pausable
	- TokenTimeLock
	- Token with Vesting period
	- ERC20 Token
Total Number of Tokens 500 million

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

* Node: Download from https://nodejs.org/en/
* Ganache-cli: add next line into command console

```
npm install -g ganache-cli
```

* Truffle: add next line into command console

```
npm install -g truffle 
```

* Babel-core: add next line into command console 

```
npm install --save-dev babel-core
```

* Babel-register: add next line into command console 

```
npm install babel-register --save-dev 
```

* Babel-es2015: add next line into command console

```
npm install --save-dev babel-preset-es2015
```

* Babel-stage-2: add next line into command console

```
npm install --save-dev babel-preset-stage-2
```

* Babel-stage-3: add next line into command console

```
npm install --save-dev babel-preset-stage-3
```

* Babel-polyfill: add next line into command console

```
npm install --save babel-polyfill
```

* chai: add next line into command console

```
npm install chai
```

* chai-as-promised: add next line into command console

```
npm install chai-as-promised
```

* chai-bignumber: add next line into command console

```
npm install chai-bignumber
```

### Installing

A step by step series of examples that tell you how to get a development env running

Start Ganache environment by opening a new command console and typing:

```
ganache-cli -a 8 
```

Install zeppelin dependecies within project file

```
npm install -E zeppelin-solidity@1.11.0
```

Compile project 

```
truffle compile
```

Migrate project

```
truffle migrate --reset 
```


## Running the tests

Automated testing is included within the Testing file, you can run it within a command console by typing:

```
truffle test
```

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing



## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors
@Vijay Paramasivam
@Waheed Rahuman Kamaluden


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments



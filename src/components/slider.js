import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { ContractsApi } from "../ContractsApi";

export class SimpleSlider extends Component {
    constructor() {
        super();
        this.state = {
            polls : 0
        }
    }
    
    async componentDidUpdate() {
        this.fetchPolls();
        setInterval(this.fetchPolls, 100000);
    }

    async fetchPolls(){
        try {
            const contractsApi = new ContractsApi();
            const nrOfPolls = await contractsApi.getPolls()
            console.log('data: ', nrOfPolls)
            for (var i = 1; i <= nrOfPolls; i++) {
                const pollInformation = await contractsApi.getPollInformation(i);
                const pollCandidates = await contractsApi.getPollCandidates(i);
                /* generate Carousel div with this data */ 
            }
          } catch (err) {
            console.log("Error: ", err)
          }
        console.log('fetchedData')
    }

    handleJoinPoll(pollID){
        const contractsApi = new ContractsApi();
        contractsApi.joinPoll(pollID);
        console.log('joinedPoll')
    }

    handleVote(pollID, value){
        const contractsApi = new ContractsApi();
        contractsApi.vote(pollID, value);
        console.log('voted')
    }

    render() {
        return (
            <Carousel>
                <div>
                    <h4>PollID</h4>
                    <h4>PollName</h4>
                    <div className="poll-description">PollDescription</div>
                    <label className="formLabel" for="option1">Option1</label>
                    <input type="radio" value="option1"></input><br />
                    <label className="formLabel" for="option2">Option2</label>
                    <input type="radio" value="option2"></input><br />
                    <span className="about-button">
                        <a className="main-btn" onClick={this.handleJoinPoll(1)}>Join Poll</a>
                    </span>
                    <span className="about-button">
                        <a className="main-btn" onClick={this.handleVote(1, 1)}>Vote</a>
                    </span>
                </div>
                {/* 
                <div>
                    <h4>POLL NAME</h4>
                    <h6>Expiration: 01.01.2022</h6>
                    <div className="poll-description">This is a poll about something really cool. Lala lala llalaaaaaa. This is a poll about something really cool. Lala lala llalaaaaaa. This is a poll about something really cool. Lala lala llalaaaaaa. This is a poll about something really cool. Lala lala llalaaaaaa. This is a poll about something really cool. Lala lala llalaaaaaa.</div>
                    <label className="formLabel" for="option1">Option 1:</label>
                    <input type="radio" value="option1"></input><br />
                    <label className="formLabel" for="option2">Option 2:</label>
                    <input type="radio" value="option2"></input><br />
                    <label className="formLabel" for="option3">Option 3:</label>
                    <input type="radio" value="option3"></input><br />
                    <span className="about-button">
                        <a className="main-btn">Join Poll</a>
                    </span>
                    <span className="about-button">
                        <a className="main-btn">Vote</a>
                    </span>
                </div>
                <div>
                    <h4>POLL NAME</h4>
                    <h6>Expiration: 01.01.2022</h6>
                    <div className="poll-description">This is a poll about something really cool. Lala lala llalaaaaaa. This is a poll about something really cool. Lala lala llalaaaaaa. This is a poll about something really cool. Lala lala llalaaaaaa. This is a poll about something really cool. Lala lala llalaaaaaa. This is a poll about something really cool. Lala lala llalaaaaaa.</div>
                    <label className="formLabel" for="option1">Option 1:</label>
                    <input type="radio" value="option1"></input><br />
                    <label className="formLabel" for="option2">Option 2:</label>
                    <input type="radio" value="option2"></input><br />
                    <label className="formLabel" for="option3">Option 3:</label>
                    <input type="radio" value="option3"></input><br />
                    <span className="about-button">
                        <a className="main-btn">Join Poll</a>
                    </span>
                    <span className="about-button">
                        <a className="main-btn">Vote</a>
                    </span>
                </div>
                */}
            </Carousel>
        );
    }
};

// Don't forget to include the css in your page

// Using webpack or parcel with a style loader
// import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

// Using html tag:
// <link rel="stylesheet" href="<NODE_MODULES_FOLDER>/react-responsive-c
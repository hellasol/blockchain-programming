import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { ContractsApi } from "../ContractsApi";

export class SimpleSlider extends Component {
    constructor() {
        super();
        this.state = {
            pollName : "testName",
            pollDescription : "testDescription lalalalallatestDescription lalalalallatestDescription lalalalallatestDescription lalalalalla",
            option1 : "TestOption1",
            option2 : "TestOption2"
        };
        this.handleJoinPoll = this.handleJoinPoll.bind(this);
        this.handleVote = this.handleVote.bind(this);
    }
    
    componentDidUpdate() {
        this.fetchData();
    }

    async fetchData(){
        const contractsApi = new ContractsApi();
        try {
            const data = await contractsApi.fetchPoll()
            console.log('data: ', data)
          } catch (err) {
            console.log("Error: ", err)
          }
        console.log('fetchedData')
    }

    handleJoinPoll(){
        console.log('joinedPoll')
    }

    handleVote(){
        console.log('voted')
    }

    render() {
        return (
            <Carousel>
                <div>
                    <h4>{this.state.pollName}</h4>
                    <div className="poll-description">{this.state.pollDescription}</div>
                    <label className="formLabel" for="option1">{this.state.option1}</label>
                    <input type="radio" value="option1"></input><br />
                    <label className="formLabel" for="option2">{this.state.option2}</label>
                    <input type="radio" value="option2"></input><br />
                    <span className="about-button">
                        <a className="main-btn" onClick={this.handleJoinPoll}>Join Poll</a>
                    </span>
                    <span className="about-button">
                        <a className="main-btn" onClick={this.handleVote}>Vote</a>
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
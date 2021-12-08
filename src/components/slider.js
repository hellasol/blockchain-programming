import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { ContractsApi } from "../ContractsApi";

export class SimpleSlider extends Component {
    constructor() {
        super();
        this.state = {
            pollName : "",
            pollDescription : "",
            option1 : "",
            option2 : ""
        };
        this.handleJoin = this.handleJoin.bind(this);
        this.handleVote = this.handleVote.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount(){
        this.fetchData();
    }

    async fetchData(){
        const contractsApi = new ContractsApi();
        try {
            const name = await contractsApi.fetchName();
            const description = await contractsApi.fetchDescription();
            const candidates = await contractsApi.fetchCandidates();
            console.log(candidates);
            this.setState(() => ({ pollName: name}));
            this.setState(() => ({ pollDescription: description}));
            this.setState(() => ({ option1: candidates[0][0]}));
            this.setState(() => ({ option2: candidates[1][0]}));
          } catch (err) {
            console.log("Error: ", err)
          }
          
        console.log('fetchedData')
    }

    handleJoin(pollID){
        const contractsApi = new ContractsApi();
        contractsApi.join(pollID);
    }

    handleVote(value){
        const contractsApi = new ContractsApi();
        contractsApi
        .vote(value)
        .onConfirmation(() => console.log('voted for', value));
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
                        <a className="main-btn" onClick={() => this.handleJoin()}>Join Poll</a>
                    </span>
                    <span className="about-button">
                        <a className="main-btn" onClick={() => this.handleVote(1)}>Vote</a>
                    </span>
                </div>
            </Carousel>
        );
    }
};
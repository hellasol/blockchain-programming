import React, { Component } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { ContractsApi } from "../ContractsApi";

//Carousel to display all open polls
export class SimpleSlider extends Component {
    constructor() {
        super();
        this.state = {
            pollName : "",
            pollDescription : "",
            option1 : "",
            option2 : "",
            votes1 : "",
            votes2 : "",
            selection:null
        };
        this.handleJoin = this.handleJoin.bind(this);
        this.handleVote = this.handleVote.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
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
            this.setState(() => ({ votes1: candidates[0][1]}));
            this.setState(() => ({ votes2: candidates[1][1]}));
          } catch (err) {
            console.log("Error: ", err)
          }
          
        console.log('fetchedData')
    }

    handleJoin(){
        const contractsApi = new ContractsApi();
        contractsApi.join();
    }

    handleVote(){
        if (this.state.selection ==  null){
            console.log("select a value")
        }
        else{
            const contractsApi = new ContractsApi();
            contractsApi
            .vote(this.state.selection)
            .onConfirmation(() => console.log('voted for', this.state.selection));
        }
    }

    onValueChange(event) {
        this.setState({
          selection: event.target.value
        });
      }

    render() {
        return (
            <Carousel>
                <div>
                    <h4>{this.state.pollName}</h4>
                    <div className="poll-description">{this.state.pollDescription}</div>
                    <label className="formLabel" htmlFor="option1">{this.state.option1}</label>
                    <label className="formLabel" htmlFor="option1">({this.state.votes1})</label>
                    <input type="radio" id="option1" name="options" value="0" onChange={this.onValueChange}></input><br />
                    <label className="formLabel" htmlFor="option2">{this.state.option2}</label>
                    <label className="formLabel" htmlFor="option2">({this.state.votes2})</label>
                    <input type="radio" id="option1" name="options" value="1" onChange={this.onValueChange}></input><br />
                    <span className="about-button">
                        <a className="main-btn" onClick={() => this.handleJoin()}>Join Poll</a>
                    </span>
                    <span className="about-button">
                        <a className="main-btn" onClick={() => this.handleVote()}>Vote</a>
                    </span>
                </div>
            </Carousel>
        );
    }
};
import React, { Component } from "react";
import Switch from "react-switch";
import { ContractsApi } from "../ContractsApi";

export default class SwitchExample extends Component {
  constructor() {
    super();
    this.state = { checked: false };
    this.handleChange = this.handleChange.bind(this);
  }

  async handleChange(checked) {
    this.setState({ checked });
    const contractsApi = new ContractsApi();
    await contractsApi.approve();
  }

  render() {
    return (
      <label>
        <Switch onChange={this.handleChange} checked={this.state.checked} />
      </label>
    );
  }
}

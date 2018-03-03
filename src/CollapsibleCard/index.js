//@flow
import React, { Component } from "react";
import { Button, Classes } from "@blueprintjs/core";
import classNames from "classnames";
import "./style.css";

type Props = {
  title: string,
  iconName: string,
  openTitleElements: boolean
};

type State = {
  open: boolean
};

export default class CollapsibleCard extends Component {
  state = {
    open: true
  };

  renderOpenCard() {
    return this.props.children;
  }

  toggleCardInfo(open) {
    this.setState({
      open
    });
  }

  render() {
    const { open }: State = this.state;
    const {
      title,
      iconName,
      icon,
      openTitleElements,
      noCard = false
    }: Props = this.props;
    return (
      <div
        className={classNames(
          { "tg-card": !noCard, open },
          this.props.className
        )}
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 15,
          paddingRight: 15
        }}
      >
        <div className="tg-card-header" style={{ marginBottom: 8 }}>
          <div className="tg-card-header-title">
            {iconName && <div className={"pt-icon-" + iconName} style={{}} />}
            {icon && <div>{icon}</div>}
            <h6
              style={{
                marginBottom: 0,
                marginRight: 10,
                marginLeft: 10
              }}
            >
              {title}
            </h6>
            <div>{open && openTitleElements}</div>
          </div>
          <div>
            <Button
              iconName={open ? "minimize" : "maximize"}
              className={classNames(Classes.MINIMAL, "info-btn")}
              onClick={() => {
                this.toggleCardInfo(!open);
              }}
            />
          </div>
        </div>
        {open && this.renderOpenCard()}
      </div>
    );
  }
}
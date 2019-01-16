import React from "react";
import Loading from "../../Loading";
import _withQuery from "./withQueryNoReact";

export default function withQuery(fragment, options = {}) {
  //passing a default LoadingComponent to withQuery
  return _withQuery(fragment, {
    ...options,
    LoadingComp: props => <Loading {...props} />
  });
}

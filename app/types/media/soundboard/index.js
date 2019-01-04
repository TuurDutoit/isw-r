// @flow

import * as actions from './actions';

export type ApiSound = {
  command: string,
  params: string,
  urlSnip: string,
  TITLE: string,
  logo: string,
};

export type Item = {
  name: string,
  label: string,
  path: string,
  basename: string,
  isFolder: boolean,
};

export type FetchStartAction = {
  type: typeof actions.FETCH_START,
};

export type FetchEndAction = {
  type: typeof actions.FETCH_END,
  items: Item[],
};

export type FetchFailAction = {
  type: typeof actions.FETCH_FAIL,
};

export type SetSearchAction = {
  type: typeof actions.SET_SEARCH,
  searchterm: string,
};

export type Action = FetchStartAction | FetchEndAction | FetchFailAction | SetSearchAction;

export type State = {|
  loading: boolean,
  failed: boolean,
  items: Item[],
  searchterm: string,
|};

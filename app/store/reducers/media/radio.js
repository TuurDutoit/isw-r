// @flow

import * as actions from '../../../types/media/radio/actions';
import type { Action } from '../../../types';
import type { State, Region } from '../../../types/media/radio';

const defaultState = (): State => ( [
  {
    name: 'VRT',
    apiName: 'vrt',
    loading: true,
    stations: [],
  },
  {
    name: 'Belgium',
    apiName: 'be',
    loading: true,
    stations: [],
  },
] );

function regionReducer( state: Region, action: Action ): Region {
  if ( action.region === state.apiName ) {
    switch ( action.type ) {
      case actions.FETCH_START:
        return { ...state, loading: true };
      case actions.FETCH_END:
        return { ...state, loading: false, stations: action.stations };
      default:
        return state;
    }
  }
  
  return state;
}

export default function radioReducer( state: State = defaultState(), action: Action ): State {
  switch ( action.type ) {
    case actions.FETCH_START:
    case actions.FETCH_END:
      return state.map( region => regionReducer( region, action ) );
    default:
      return state;
  }
}

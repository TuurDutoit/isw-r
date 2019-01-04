// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, AsyncStorage } from 'react-native';
import { Footer, Text, Button, Toast } from 'native-base';
import PinModal from './PinModal.js';
import { TEXT, FOOTER } from '/styles';
import { resetBasket } from '/store/actions/shop.js';
import type { Basket } from '/types/shop';
import type { State, Dispatch } from '/types';
import { SHOP_API_ORDER_URL } from '/config';

type Props = {
  username: string,
  pin: string,
  total: number,
  basket: Basket,
  canOrder: boolean,
  resetBasket: () => void,
};

type LocalState = {
  modalVisible: boolean,
  wrongPin: boolean,
};

class Order extends Component<Props, LocalState> {
  state = {
    modalVisible: false,
    wrongPin: false,
  };
  
  performOrder( pin: string ) {
    pay( this.props.username, pin, this.props.basket )
      .then( () => {
        this.props.resetBasket();
        Toast.show( {
          text: 'Payment successful!',
          type: 'success',
          buttonText: 'Okay',
        } );
      } )
      .catch( e => {
        if ( e === 403 ) {
          this.openModal( true );
        }
        else {
          Toast.show( {
            text: 'Oops! Something went wrong.',
            type: 'danger',
            buttonText: 'Okay',
          } );
        }
      } );
    
  }
  
  order() {
    AsyncStorage.getItem( 'pin' )
      .then( pin => {
        if ( pin ) {
          this.performOrder( pin );
        }
        else {
          this.openModal();
        }
      } );
  }
  
  onPin( pin: string ) {
    this.closeModal();
    this.performOrder( pin );
  }
  
  openModal( wrongPin: boolean = false ) {
    this.setState( { modalVisible: true, wrongPin } );
  }
  
  closeModal() {
    this.setState( { modalVisible: false } );
  }
  
  render() {
    return (
      <Footer style={styles.basket}>
        <Text style={styles.total}>€{this.props.total.toFixed( 2 )}</Text>
        <Button rounded success
          onPress={this.order.bind( this )}
          disabled={!this.props.canOrder}
        >
          <Text>PAY</Text>
        </Button>
        <PinModal
          visible={this.state.modalVisible}
          wrongPin={this.state.wrongPin}
          onCancel={this.closeModal.bind( this )}
          onPin={this.onPin.bind( this )}
        />
      </Footer>
    );
  }
}

const styles = StyleSheet.create( {
  basket: {
    ...FOOTER,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {
    ...TEXT,
    fontSize: 25,
  },
} );

function pay( username: string, pin: string, basket: Basket ): Promise<void> {
  return new Promise( ( resolve, reject ) => {
    for ( const [ item_id, amount ] of Object.entries( basket ) ) {
      fetch( SHOP_API_ORDER_URL, {
        method: 'POST',
        headers: new Headers( {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: username + ':' + pin,
        } ),
        body: JSON.stringify( {
          subscription: false,
          item_id,
          amount,
        } ),
      } )
        .then( res => res.ok ? resolve() : reject( res.status ) )
        .catch( reject );
    }
  } );
}

function mapStateToProps( state: State ) {
  return {
    username: state.shop.username,
    total: state.shop.total,
    canOrder: state.shop.total > 0,
    basket: state.shop.basket,
  };
}

function mapDispatchToProps( dispatch: Dispatch ) {
  return {
    resetBasket() {
      dispatch( resetBasket() );
    },
  };
}

export default connect( mapStateToProps, mapDispatchToProps )( Order );
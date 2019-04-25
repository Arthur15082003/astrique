import React from 'react';
import FetchApi from '../../helpers/FetchApi';
import './index.css';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { Navbar, NavbarBrand, Collapse, NavbarToggler, Nav, NavItem, NavLink, Container, Row, Col } from 'reactstrap';

class HomeRoute extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      selectedCollection: {},
      listings: [],
      collections: [],
      authors: [],
      author: '',
      loading: true,
    }
  }

  componentDidMount() {
    this.getListings();
    this.getCollections();
    this.getAuthors();
  }

  async getListings(evt, selectedCollection = {}, author = '') {
    if (evt) evt.preventDefault();
    this.setState({loading: true});
    try {
      let url = '/api/listings';
      if (selectedCollection.id) {
        url = `${url}?collectionId=${selectedCollection.id}`
      }
      if (author) {
        if(selectedCollection.id) {
          url = `${url}&author=${author}`
        } else {
          url = `${url}?author=${author}`
        }
      }
      const listings = await FetchApi.get(url);

      this.setState({listings: listings.data.data, selectedCollection, author, loading: false});
    } catch (e) {
      console.error(e);
    }
  }

  async getAuthors() {
    try {
      const authors = await FetchApi.get('/api/authors');
      this.setState({authors: authors.data.data});
    } catch (e) {
      console.error(e);
    }
  }

  async getCollections() {
    try {
      const collections = await FetchApi.get('/api/collections');
      this.setState({collections: collections.data.data});
    } catch (e) {
      console.error(e);
    }
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <section id="home">
        <header className="App-header">
          <Navbar light  expand="md">
            <NavbarBrand>
              Home
            </NavbarBrand>
            <NavbarToggler onClick={() => this.toggle()} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav>
                {/*
                  <NavItem>
                    <Link className="nav-link" to="/">Collections</Link>
                  </NavItem>
                */}
              </Nav>
            </Collapse>
          </Navbar>
        </header>
        <main>
          <Container>
            <Row>
              <Col xs="2">
                <div style={{padding: '.5rem 0', fontWeight: 700}}>
                  Collections
                </div>
              </Col>
              <Col xs="10">
                <Nav className="filter">
                  <NavItem>
                    <NavLink style={{color: !this.state.selectedCollection.id ? 'black': '#999999'}} onClick={(evt)=>this.getListings(evt, {}, '')}>All</NavLink>
                  </NavItem>
                  {this.state.collections.map(el => (
                      <NavItem>
                        <NavLink style={{color: this.state.selectedCollection.id == el.id ? 'black': '#999999'}} onClick={(evt)=>this.getListings(evt, el, '')}>{el.name}</NavLink>
                      </NavItem>
                    )
                  )}
                </Nav>
              </Col>
            </Row>
            <Row style={{marginBottom: '20px', borderBottom: '1px solid #eaeaea'}}>
              <Col xs="2">
                <div style={{padding: '.5rem 0', fontWeight: 700}}>
                  Artists
                </div>
              </Col>
              <Col xs="10">
                <Nav className="filter">
                  <NavItem>
                    <NavLink style={{color: !this.state.author ? 'black': '#999999'}} onClick={(evt)=>this.getListings(evt, {}, '')}>All</NavLink>
                  </NavItem>
                  {this.state.authors.map(el => (
                      <NavItem>
                        <NavLink style={{color: el == this.state.author ? 'black': '#999999'}} onClick={(evt)=>this.getListings(evt, {}, el)}>{el}</NavLink>
                      </NavItem>
                    )
                  )}
                </Nav>
              </Col>
            </Row>
            <Row>
              <Col>
                <h2>
                  {!this.state.selectedCollection.id ? 'Our clothes' : this.state.selectedCollection.name}
                  {!this.state.author && this.state.selectedCollection.id && ` by ${this.state.selectedCollection.author}`}
                  {!this.state.author && !this.state.selectedCollection.id && ' by our artists'}
                  {this.state.author && ` by ${this.state.author}`}
                </h2>
              </Col>
            </Row>
            {this.state.loading ? (
                <div style={{margin: '50px auto', textAlign: 'center', height: '500px'}}>
                  <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
              ) : (
              <Row>
                {this.state.listings.map((el, index) => (
                  <Col xs="12" md="4" key={el.id}>
                    <div className={"listing-block-container"}>
                      <div style={{backgroundImage: `url(${FetchApi.getUrl()}/media/${el.photo})`}} className="listing-block"></div>
                      <div>
                        <p>
                          {el.name}
                        </p>
                        <em>
                          by {el.author}
                        </em>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </main>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    
  };
}

export default connect(mapStateToProps)(HomeRoute);

import { Nav, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import { ABOUT, ARMOR_DAMAGE_CALC, DATA_SHEETS_AMMO, DATA_SHEETS_ARMOR, DATA_SHEETS_EFFECTIVENESS_AMMO, DATA_SHEETS_EFFECTIVENESS_ARMOR, DATA_SHEETS_WEAPONS, HOME, MODDED_WEAPON_BUILDER } from '../Util/links';

function BrandExample() {
    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
                <Container >
                    <LinkContainer to={HOME}>
                        <Navbar.Brand>
                            <img
                                alt=""
                                src="/TG_icon.png"
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                            />{' '}
                            Tarkov Gunsmith
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav id="nav-dropdown">
                            <LinkContainer to={MODDED_WEAPON_BUILDER}>
                                <Nav.Link>Modded Weapon Builder</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to={ARMOR_DAMAGE_CALC}>
                                <Nav.Link>Armor Damage Calculator</Nav.Link>
                            </LinkContainer>

                            <NavDropdown title="Data Tables" id="nav-dropdown" style={{ color: "black" }}>

                                <NavDropdown.Item>
                                    <LinkContainer to={DATA_SHEETS_AMMO}>
                                        <Nav.Link>Ammo</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>

                                <NavDropdown.Item>
                                    <LinkContainer to={DATA_SHEETS_ARMOR}>
                                        <Nav.Link>Armor</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>

                                <NavDropdown.Item>
                                    <LinkContainer to={DATA_SHEETS_WEAPONS}>
                                        <Nav.Link>Weapons</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>

                                <NavDropdown.Item>
                                    <LinkContainer to={DATA_SHEETS_EFFECTIVENESS_AMMO}>
                                        <Nav.Link>Ammo Effectiveness</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>

                                <NavDropdown.Item>
                                    <LinkContainer to={DATA_SHEETS_EFFECTIVENESS_ARMOR}>
                                        <Nav.Link>Armor Effectiveness</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>              
                            </NavDropdown>

                            <LinkContainer to={ABOUT}>
                                <Nav.Link>About</Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default BrandExample;
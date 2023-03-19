
import { Nav, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import { ABOUT, DAMAGE_SIMULATOR, DATA_SHEETS_AMMO, DATA_SHEETS_ARMOR, AMMO_VS_ARMOR, AMMO_EFFECTIVENESS_CHART, ARMOR_VS_AMMO, DATA_SHEETS_WEAPONS, HOME, MODDED_WEAPON_BUILDER } from '../Util/links';

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

                            <LinkContainer to={DAMAGE_SIMULATOR}>
                                <Nav.Link>Terminal Ballistics Simulator</Nav.Link>
                            </LinkContainer>

                            <NavDropdown title="Data Tables" id="data-dropdown" style={{ color: "black" }}>
                                <NavDropdown.Item>
                                    <LinkContainer to={AMMO_EFFECTIVENESS_CHART}>
                                        <Nav.Link>Ammo Effectiveness</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>

                                <NavDropdown.Item>
                                    <LinkContainer to={AMMO_VS_ARMOR}>
                                        <Nav.Link>Ammo vs Armor</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>

                                <NavDropdown.Item>
                                    <LinkContainer to={ARMOR_VS_AMMO}>
                                        <Nav.Link>Armor vs Ammo</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>
                            </NavDropdown>
                            
                            <NavDropdown title="Stats Tables" id="stats-dropdown" style={{ color: "black" }}>
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

import { Nav, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import { LINKS } from '../Util/links';

export function OldBsHeaderNavbar() {
    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
                <Container >
                    <LinkContainer to={LINKS.HOME}>
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
                            <LinkContainer to={LINKS.MODDED_WEAPON_BUILDER}>
                                <Nav.Link>Modded Weapon Builder</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to={LINKS.DAMAGE_SIMULATOR}>
                                <Nav.Link>Terminal Ballistics Simulator</Nav.Link>
                            </LinkContainer>
                            <NavDropdown title="Ballistics Simulators" id="data-dropdown" style={{ color: "black" }}>
                                <NavDropdown.Item>
                                    <LinkContainer to={LINKS.BALLISTICS_SIMULATOR}>
                                        <Nav.Link >Penetration and Damage</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>
                            </NavDropdown>

                            <NavDropdown title="Data Tables" id="data-dropdown" style={{ color: "black" }}>
                                <NavDropdown.Item>
                                    <LinkContainer to={LINKS.AMMO_EFFECTIVENESS_CHART}>
                                        <Nav.Link disabled>Ammo Effectiveness</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>

                                <NavDropdown.Item>
                                    <LinkContainer to={LINKS.AMMO_VS_ARMOR}>
                                        <Nav.Link disabled>Ammo vs Armor</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>

                                <NavDropdown.Item>
                                    <LinkContainer to={LINKS.ARMOR_VS_AMMO}>
                                        <Nav.Link disabled>Armor vs Ammo</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>
                            </NavDropdown>

                            <NavDropdown title="Stats Tables" id="stats-dropdown" style={{ color: "black" }}>
                                <NavDropdown.Item>
                                    <LinkContainer to={LINKS.DATA_SHEETS_WEAPONS}>
                                        <Nav.Link>Weapons</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>

                                <NavDropdown.Item>
                                    <LinkContainer to={LINKS.DATA_SHEETS_AMMO}>
                                        <Nav.Link>Ammo</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>
                                
                                <NavDropdown.Item>
                                    <LinkContainer to={LINKS.DATA_SHEETS_ARMOR}>
                                        <Nav.Link >Armor</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>

                                <NavDropdown.Item>
                                    <LinkContainer to={LINKS.DATA_SHEETS_HELMETS}>
                                        <Nav.Link>Helmets</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>

                                <NavDropdown.Item>
                                    <LinkContainer to={LINKS.DATA_SHEETS_ARMOR_MODULES}>
                                        <Nav.Link>Armor Modules (Plates/Inserts)</Nav.Link>
                                    </LinkContainer>
                                </NavDropdown.Item>
                            </NavDropdown>

                            <LinkContainer to={LINKS.ABOUT}>
                                <Nav.Link>About</Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}
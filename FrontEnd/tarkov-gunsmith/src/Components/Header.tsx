import { Nav, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import { ABOUT, ARMOR_DAMAGE_CALC, HOME, MODDED_WEAPON_BUILDER, ADC_CUSTOM } from '../Util/links';

function BrandExample() {
    return (
        <>
            <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" fixed="top">
                <Container>
                    <LinkContainer to={HOME}>
                        <Navbar.Brand>
                            <img
                                alt=""
                                src="/favicon.ico"
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                            />{' '}
                            Tarkov-Gunsmith
                        </Navbar.Brand>
                        </LinkContainer>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav>
                            <LinkContainer to={MODDED_WEAPON_BUILDER}>
                                <Nav.Link>Modded Weapon Builder</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to={ARMOR_DAMAGE_CALC}>
                                <Nav.Link>Armor Damage Calculator</Nav.Link>
                            </LinkContainer>


                            <LinkContainer to={ADC_CUSTOM}>
                                <Nav.Link>ADC Custom</Nav.Link>
                            </LinkContainer>

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
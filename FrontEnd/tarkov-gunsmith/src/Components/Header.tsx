import { Nav } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import { ABOUT, ARMOR_DAMAGE_CALC, HOME, MODDED_WEAPON_BUILDER } from '../links';

function BrandExample() {
    return (
        <>
            <Navbar bg="dark" variant="dark" fixed="top">
                <Container>
                    <Nav>
                    <LinkContainer to={HOME}>
                        <Navbar.Brand>
                            <img
                                alt=""
                                src="/favicon.ico"
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                            />{' '}
                            Tarkov Gunsmith
                        </Navbar.Brand>
                        </LinkContainer>
                        <LinkContainer to={MODDED_WEAPON_BUILDER}>
                            <Nav.Link>Modded Weapon Builder</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to={ARMOR_DAMAGE_CALC}>
                            <Nav.Link>Armor Damage Calculator</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to={ABOUT}>
                            <Nav.Link>About</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default BrandExample;
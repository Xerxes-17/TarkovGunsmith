import { Row, Col, Card } from "react-bootstrap";

// Renders the home
export default function Home(props: any) {
    return (
        <>
            <h1 className="section-title">Welcome to Tarkov-Gunsmith!</h1>
            <br />
            <div className="row gy-2">
                <Col xl>
                    <Card bg="dark" border="secondary" text="light" className="mb-2" style={{ height: "100%" }}>
                        <Card.Header as="h5">Modded Weapon Builder</Card.Header>
                        <Card.Img style={{ maxHeight: '214px', objectFit: 'contain', marginTop: "5px" }} variant="top" src={process.env.PUBLIC_URL + '/WeaponBuilderInfoPic.png'} />
                        <Card.Body>
                            <Card.Text>
                                For many players of the hit looter-shooter Escape from Tarkov, the gunplay and
                                gun modification is a major draw card of the title.
                            </Card.Text>
                            <Card.Text>
                                However with the complexity
                                and variety that can be found with over a thousand Weapon Mods in game, making
                                the best choices can be a problem and many will wait for streamers and YouTube
                                guides to show them how to build a weapon or in general.
                            </Card.Text>
                            <Card.Text>
                                The purpose of the MWB
                                is to allow a user to set a range of parameters, such as the PMC level, and then
                                receive a build or (in future) a list of builds which fit this criteria.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl>
                    <Card bg="dark" border="secondary" text="light" className="mb-2" style={{ height: "100%" }}>
                        <Card.Header as="h5">Armor Damage Calculator</Card.Header>
                        <Card.Img style={{ maxHeight: '214px', objectFit: 'contain', marginTop: "5px" }} variant="top" src={process.env.PUBLIC_URL + '/ArmorDamageInfoPic.png'} />
                        <Card.Body>
                            <Card.Text>
                                Another area of somewhat arcane knowledge for the player base is
                                how armor takes damage on hits from various bullets. After much testing it was
                                worked out and now it can be easily looked up on this page.
                            </Card.Text>
                            <Card.Text>
                                You can currently search by Armor name, Bullet name and set the starting
                                durability of the armor. Select one of the results of each and then request
                                the result.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </div>
        </>
    );
}
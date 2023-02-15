import { Col, Card, Nav, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { ARMOR_DAMAGE_CALC, MODDED_WEAPON_BUILDER } from "../Util/links";

// Renders the home
export default function Home(props: any) {
    return (
        <>
            <Card bg="dark" border="secondary" text="light" className="mb-2" style={{ height: "100%" }}>
                <Card.Header as="h1">
                    Welcome to Tarkov Gunsmith!

                </Card.Header>
            </Card>
            <div className="row gy-2 mb-2">
                <Col xl>

                    <Card bg="dark" border="secondary" text="light" className="mb-2" style={{ height: "100%" }}>
                        <LinkContainer to={MODDED_WEAPON_BUILDER}>
                            <Nav.Link>
                                <Card.Header as="h5">Modded Weapon Builder</Card.Header>
                            </Nav.Link>
                        </LinkContainer>
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
                        <LinkContainer to={ARMOR_DAMAGE_CALC}>
                            <Nav.Link>
                                <Card.Header as="h5">Armor Damage Calculator</Card.Header>
                            </Nav.Link>
                        </LinkContainer>
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
                            <Card.Text>
                                There is also a custom mode too if you'd like to model some theoretical ideas.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl>
                    <Card bg="dark" border="secondary" text="light" className="mb-2" style={{ height: "100%" }}>
                        <Nav.Link href="https://discord.gg/F7GZE4H7fq">
                            <Card.Header as="h5">Discord</Card.Header>
                        </Nav.Link>
                        <Card.Body style={{ textAlign: "center" }}>
                            <iframe
                                src="https://discord.com/widget?id=1071286504623710228&theme=dark"
                                width="350"
                                height="450"
                                allowTransparency={true}
                                title="discordWidget"
                                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"

                            />
                            <Card.Text style={{ textAlign: "left" }}>
                                There is a discord, as you would expect. Come and thank me, report a bug, request a feature or all of the above!
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </div>

            <hr style={{color:"azure"}}/>

            <Row className="row gy-2 mb-2">
                <Col >
                    <Card bg="dark" border="secondary" text="light" className="mb-2" style={{ height: "100%" }}>
                        <Card.Header as="h3">
                            Development Blog
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                I figure that keeping some record of what's been happening along with my thought process
                                behind changes and decisions could be useful and also interesting to other people.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card bg="dark" border="secondary" text="light" className="mb-2" style={{ height: "100%" }}>
                        <Card.Header as="h5">
                            14/02/2023
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                While checking over some build results with the MWB, I found out that things weren't
                                working correctly with M4-pattern weapons due to an assumption of mine being incorrect.
                                In my logic, the assumption is that adding on any modification will lead to improvement
                                of the stats. This does hold true for most weapons, but for the M4-pattern guns, they
                                have a very high base ergo that is then taken away from by the gun barrel. So at the
                                moment, when you are in ergonomics mode, the program correctly chooses to not attach a
                                barrel, as it reduces the total ergonomics. <br/><br/>

                                What's more, the flag for something being
                                required is set on the slot, not the mod, and the way I process the filtering of blocking
                                mods is mod-centric and doesn't account for the slots. For now I've disabled the ergonomics
                                priority while I work on solving the issue. Recoil modes still work fine however, and I'm
                                also happy to release the "Meta Recoil" mode where the best recoil modifier is selected 
                                for in a slot. Then from the remaining options at this max value, the best ergonomics value 
                                is found and filtered and lastly they are sorted to have the lowest price, 
                                which is then chosen. Check it out!<br/><br/>

                                Another issue you might have noticed recently was the loss of a bunch of options from the
                                selection menus, this was due to a change in the tarkov-dev API in the way that default 
                                weapon presets were named and ID'd. This has now been fixed. <br/><br/>

                                I've also made a bunch of small UI/UX improvements. An example of this was to change the 
                                build/calculate buttons to a more eye-catching green, and adding indicator buttons to the 
                                level select in the MWB which shows what loyalty level a trader will be at the current player
                                level.
                            </Card.Text>

                            <Card.Text>

                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
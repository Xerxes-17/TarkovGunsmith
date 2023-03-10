import { Col, Card, Nav, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { ARMOR_DAMAGE_CALC, MODDED_WEAPON_BUILDER, DATA_SHEETS_EFFECTIVENESS_AMMO_SIMPLE } from "../Util/links";

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
                                <Card.Header as="h5">Terminal Ballistics Simulator</Card.Header>
                            </Nav.Link>
                        </LinkContainer>
                        <Card.Img style={{ maxHeight: '214px', objectFit: 'contain', marginTop: "5px" }} variant="top" src={process.env.PUBLIC_URL + '/ArmorDamageInfoPic.png'} />
                        <Card.Body>
                            <Card.Text>
                                Another area of somewhat arcane knowledge for the player base is
                                how armor and characters take damage on hits from various bullets. After much testing
                                it has now been worked out and it can be easily looked up on this page.
                            </Card.Text>
                            <Card.Text>
                                You can currently search by Armor name, Bullet name and set the starting
                                durability of the armor. Select one of the results of each and then request
                                the result.
                            </Card.Text>
                            <Card.Text>
                                There is also a custom mode too if you'd like to model some theoretical ideas, or
                                if I haven't kept up with some patch.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </div>
            <div className="row gy-2 mb-2">
                <Col xl>
                    <Card bg="dark" border="secondary" text="light" className="mb-2" style={{ height: "100%" }}>
                        <LinkContainer to={DATA_SHEETS_EFFECTIVENESS_AMMO_SIMPLE}>
                            <Nav.Link>
                                <Card.Header as="h5">Info Tables</Card.Header>
                            </Nav.Link>
                        </LinkContainer>
                        <Card.Img style={{ maxHeight: '214px', objectFit: 'contain', marginTop: "5px" }} variant="top" src={process.env.PUBLIC_URL + '/datas.png'} />
                        <Card.Body>
                            <Card.Text>
                                Info tables are now available in two types: data and stats.
                            </Card.Text>
                            <Card.Text>
                                Stats tables will provide in-game information in a simple format. Useful for looking up a detail or a set of items quickly, includes hidden stats which are important.
                                Currently cover Ammo, Armor and Weapons.
                            </Card.Text>
                            <Card.Text>
                                There are three data tables, the first is my take on an ammo effectiveness chart, and the other are Ammo vs Armor and Armor vs Ammo. <br/>
                                Eg: With Ammo vs Armor, you will see how that bullet fares against all armor items. With Armor vs Ammo, you will see how a given armor will perform against a selected range of rounds.
                            </Card.Text>
                            <Card.Text>
                                As the data tables are base upon data provided by simulating Tarkov game mechanics, they are more accurate than NoFoodAfterMidnight's commonly cited ammo effectiveness chart.
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

            <hr style={{ color: "azure" }} />

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
            <Row className="row gy-2 mb-2">
                <Col>
                    <Card bg="dark" border="secondary" text="light" className="mb-2" style={{ height: "100%" }}>
                        <Card.Header as="h5">
                            6/03/2023
                        </Card.Header>
                        <Card.Body>

                            <Card.Text>
                                The ammo effectiveness chart is now finished, and looking great! When designing it I decided to go with "hits to kill" as my scale because I think the current and common view of 
                                by pure penetration doesn't present the whole picture on how effective a given round is. For instance, some high penetration rounds won't even kill on head shots due to armor damage mitigation.
                                But with my chart, this is accounted for. The scale also shows how rounds perform against the thorax or head, as these numbers can differ significantly.<br /><br />

                                As a part of this table and the other ones I've added, I've had to expand and update the functionality of the Armor Damage Calculator to be beyond its initial scope, so now I've changed the name to 
                                "Terminal Ballistics Simulator". Since this function now encompasses both armor and character damage as a focus, I think this name better reflects its new capabilities. I still gotta update the custom mode though.<br /><br />
                            </Card.Text>
                            <Card.Img variant="bottom" src={process.env.PUBLIC_URL + '/blog_dt_aec_1.png'} style={{ maxWidth: 957, maxHeight: 1044 }} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="row gy-2 mb-2">
                <Col>
                    <Card bg="dark" border="secondary" text="light" className="mb-2" style={{ height: "100%" }}>
                        <Card.Header as="h5">
                            5/03/2023
                        </Card.Header>
                        <Card.Body>

                            <Card.Text>
                                I've now added two data tables which will provide an easy way of looking at how effective a given armor item or ammo projectile is.<br /><br />

                                The idea behind these tables is that the key criteria of effectiveness is shots to kill. So if you put on an armor vest, you want to know how many
                                bullets it will protect you from of each type. While if you are going to use a bullet for your weapon, how many shots it will take to kill someone using a given vest.<br /><br />

                                These tables can be made full-screen and some columns start out hidden, which you can change, in addition to being filterable and sortable. I will probably add more features as
                                I learn more about Material React Table.<br /><br />
                            </Card.Text>
                            <Card.Img variant="bottom" src={process.env.PUBLIC_URL + '/blog_dt_1.png'} style={{ maxWidth: 957, maxHeight: 1044 }} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="row gy-2 mb-2">
                <Col>
                    <Card bg="dark" border="secondary" text="light" className="mb-2" style={{ height: "100%" }}>
                        <Card.Header as="h5">
                            3/03/2023
                        </Card.Header>
                        <Card.Body>

                            <Card.Text>
                                First up, the MWB now has a "power curves" window displayed under a build. This will allow a user too see
                                where they are relatively speaking with a given build, and can give a sense for how developed a build is
                                at a given level. <br /><br />

                                Second, I've now added "Data Sheets" which can now display the properties of Ammo, Armor and Weapons.
                                It uses Material React Table, which allows for advanced features like grouping, filtering, moving columns, etc. <br /><br />

                                Third, "Enhanced Logic" for the MWB has been expanded to cover the edge cases of Kalashnikovs, G36, SA-58, HK416A5, AUG A1/3.  <br /><br />

                                Fourth, Probably a bunch of smaller backend changes I can't remember.

                            </Card.Text>
                            <Card.Img variant="bottom" src={process.env.PUBLIC_URL + '/blog_mwb_curves.png'} style={{ maxHeight: 485, maxWidth: 939 }} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row gy-2 mb-2">
                <Col>
                    <Card bg="dark" border="secondary" text="light" className="mb-2" style={{ height: "100%" }}>
                        <Card.Header as="h5">
                            24/02/2023
                        </Card.Header>
                        <Card.Body>

                            <Card.Text>
                                We now have cumulative and shot probabilities of kill in the ADC!
                                Huge thanks to fellow goon Night Shade for contributing the function to make it possible.
                                With this addition, it is probably high time to get to work on the comparison charts and graphs page. <br /><br />

                                I've also added download and copy to clipboard buttons to the ADC to make sharing easier.
                            </Card.Text>
                            <Card.Img variant="bottom" src={process.env.PUBLIC_URL + '/blog_adc_2.png'} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row gy-2 mb-2">
                <Col>
                    <Card bg="dark" border="secondary" text="light" className="mb-2" style={{ height: "100%" }}>
                        <Card.Header as="h5">
                            21/02/2023
                        </Card.Header>
                        <Card.Body>

                            <Card.Text>
                                A little quicker this time, but the ADC is much simpler to work on.<br /><br />

                                I've now added Rate of Fire as a purely front-end aspect to the ADC, so now you can
                                compare the, a SCAR-L (650rpm) vs the HK-416 (850rpm) without needing to submit
                                for a new calc.<br /><br />

                                Additionally, I've now added in the expected blunt, penetration, average damage and remaining
                                hit points columns to the calculation series. From this you can now of course work out rough
                                shots to kill (STK) and time to kill (TTK) results for thorax or head shots! I would like to also add in a binomial probability column,
                                but I am in fact bad @ math so I haven't been able to implement it yet. If anyone would like to
                                help me out with that, I'd greatly appreciate it! ???? <br /> <br />

                                This new feature is also hugely important because now we have the ability to start charting out
                                how effective a given round should be vs all of the armors in a set of options, in a similar way to
                                nofoodaftermidnight's chart. However it will be better as he gives a rough average for a given class,
                                which has the problem of not accounting for the variation in effective durability. For example
                                a 7.62x39 PS round has a STK of 5 vs a Korund, which isn't too bad, but against a Redut-T5, this becomes
                                an STK of 10, which isn't so great. But anyway, charts coming soon!???<br /> <br />

                                With that done, it's time for a big code-cleanup pass before I add any more features.
                            </Card.Text>
                            <Card.Img variant="bottom" src={process.env.PUBLIC_URL + '/blog_adc_1.png'} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="row gy-2 mb-2">
                <Col>
                    <Card bg="dark" border="secondary" text="light" className="mb-2" style={{ height: "100%" }}>
                        <Card.Header as="h5">
                            20/02/2023
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Damn, almost a week since the last update, and that's been for a good reason; I've been
                                going over the backend code for how weapons are built, first to fix the recent change to
                                the dev-tarkov API and then to improve the accuracy and validity of the builder.<br /><br />

                                I've fixed presets issue and as to the fitting algorithm,  I've broken down an decided upon a mixed approach, where for weapons
                                where a simple logic can work will use that, and for troublesome edge cases they will get specific
                                and enhanced logic to deal with them. And example of this is the upper receiver, barrel, gas block,
                                muzzle device and hand guard selection problem for AR-15 type weapons.<br /><br />

                                The problem here was that the conflicting items data is spread out, and that simply
                                selecting for the immediate best option doesn't always give the best total result in the end
                                due to the loss of later attachments which would've put the 2nd choice in that slot ahead,
                                as it can use the lost attachment(s). The way I've gotten around this was to sit down and
                                think through the combination process and simply brute-force through all of the permutations
                                for this area. I had wanted to try and stick to using common rules for all, but this is
                                easier to develop and perhaps, ultimately more maintainable. Funnily enough, this had been
                                my idea when I started working on this about a year ago, but the lack of deep cloning in the
                                RatStash library at the time scuppered this.<br /><br />

                                I'll also be able to apply this approach to other problem areas soon, such as the hand
                                guard/dust cover problem for AKs, the combo pistol grip and stock options for AKs and ARs
                                and so on. For most other weapons, they have simple modding possibilities, so the less
                                complex selection method should be fine. As an aside, I've added a simple validity of
                                build check, so the user should be notified if something has bugged out and they are given
                                a build that isn't possible.<br /><br />

                                But first, I'm going to improve the front end first, and add some extra features to the ADC.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="row gy-2 mb-2">
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
                                barrel, as it reduces the total ergonomics. <br /><br />

                                What's more, the flag for something being
                                required is set on the slot, not the mod, and the way I process the filtering of blocking
                                mods is mod-centric and doesn't account for the slots. For now I've disabled the ergonomics
                                priority while I work on solving the issue. Recoil modes still work fine however, and I'm
                                also happy to release the "Meta Recoil" mode where the best recoil modifier is selected
                                for in a slot. Then from the remaining options at this max value, the best ergonomics value
                                is found and filtered and lastly they are sorted to have the lowest price,
                                which is then chosen. Check it out!<br /><br />

                                Another issue you might have noticed recently was the loss of a bunch of options from the
                                selection menus, this was due to a change in the tarkov-dev API in the way that default
                                weapon presets were named and ID'd. This has now been fixed. <br /><br />

                                I've also made a bunch of small UI/UX improvements. An example of this was to change the
                                build/calculate buttons to a more eye-catching green, and adding indicator buttons to the
                                level select in the MWB which shows what loyalty level a trader will be at the current player
                                level.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
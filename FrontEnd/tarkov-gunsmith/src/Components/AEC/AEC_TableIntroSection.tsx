import { Box } from "@mui/material";
import { Col, Card, Accordion } from "react-bootstrap";
import { MY_BLUE, MY_GREEN, MY_ORANGE, MY_PURPLE, MY_RED, MY_YELLOW, getEffectivenessColorCodeString } from "./AEC_Helper_Funcs";

export default function AECTableIntroSection(props: any) {
    return (
        <Col xxl>
            <Card bg="dark" border="secondary" text="light" className="xxl">
                <Card.Header as="h2" >
                    Ammo Effectiveness Table
                </Card.Header>
                <Card.Body>
                    <>
                        This table shows the effectiveness rating of all ammo on the basis of average <strong>Hits to kill</strong> for a given AC like so:<br />
                        &nbsp;
                        <Box
                            component="span"
                            sx={() => ({
                                backgroundColor: getEffectivenessColorCodeString("3.1.6 | 55%", 1),
                                borderRadius: '0.25rem',
                                color: '#fff',
                                maxWidth: '9ch',
                                p: '0.25rem',
                            })}
                        >
                            <span>3.1.6 | 55%</span>
                        </Box>
                        &nbsp;
                        in the format of: "<strong>HitsToKill[Thorax.Head.Legs] | (First shot penetration chance)</strong>".<br /><br />
                        Each cell is highlighted to how effective it is against a <strong>thorax</strong> target: <br />

                        <ul>

                            <li className='special_li'>
                                <Box
                                    component="span"
                                    sx={() => ({
                                        backgroundColor: MY_PURPLE,
                                        borderRadius: '0.25rem',
                                        color: '#fff',
                                        maxWidth: '9ch',
                                        p: '0.25rem',
                                    })}
                                >
                                    Incredible
                                </Box>
                                &nbsp;kills with 1 thorax hit on average.
                            </li>

                            <li>
                                <Box
                                    component="span"
                                    sx={() => ({
                                        backgroundColor: MY_BLUE,
                                        borderRadius: '0.25rem',
                                        color: '#fff',
                                        maxWidth: '9ch',
                                        p: '0.25rem',
                                    })}
                                >
                                    Excellent
                                </Box>
                                &nbsp;kills with 2 thorax hits on average.
                            </li>
                            <li>
                                <Box
                                    component="span"
                                    sx={() => ({
                                        backgroundColor: MY_GREEN,
                                        borderRadius: '0.25rem',
                                        color: '#fff',
                                        maxWidth: '9ch',
                                        p: '0.25rem',
                                    })}
                                >
                                    Good
                                </Box>
                                &nbsp;kills with 3 or 4 thorax hits on average.
                            </li>
                            <li>
                                <Box
                                    component="span"
                                    sx={() => ({
                                        backgroundColor: MY_YELLOW,
                                        borderRadius: '0.25rem',
                                        color: '#fff',
                                        maxWidth: '9ch',
                                        p: '0.25rem',
                                    })}
                                >
                                    Okay
                                </Box>
                                &nbsp;kills with 5 or 6 thorax hits on average.
                            </li>
                            <li>
                                <Box
                                    component="span"
                                    sx={() => ({
                                        backgroundColor: MY_ORANGE,
                                        borderRadius: '0.25rem',
                                        color: '#fff',
                                        maxWidth: '9ch',
                                        p: '0.25rem',
                                    })}
                                >
                                    Poor
                                </Box>
                                &nbsp;kills with 7 or 8 thorax hits on average.
                            </li>
                            <li>
                                <Box
                                    component="span"
                                    sx={() => ({
                                        backgroundColor: MY_RED,
                                        borderRadius: '0.25rem',
                                        color: '#fff',
                                        maxWidth: '9ch',
                                        p: '0.25rem',
                                    })}
                                >
                                    Terrible
                                </Box>
                                &nbsp;kills with 9+ thorax hits on average.
                            </li>
                        </ul>
                        <Accordion defaultActiveKey="0" flush>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    Example:&nbsp;<em>5.45x39mm PS gs</em>&nbsp;against armor classes:
                                </Accordion.Header>
                                <Accordion.Body>
                                    <ul>
                                        {/* <li>You will kill a player in 6 leg shots when we account for fragmentation.</li> */}
                                        <li>
                                            AC 2 &nbsp;
                                            <Box
                                                component="span"
                                                sx={() => ({
                                                    backgroundColor: getEffectivenessColorCodeString("2.1.6 | 97%", 1),
                                                    borderRadius: '0.25rem',
                                                    color: '#fff',
                                                    maxWidth: '9ch',
                                                    p: '0.25rem',
                                                })}
                                            >
                                                <span>2.1.6 | 97%</span>
                                            </Box>
                                            &nbsp; You will usually kill on 2 <strong>thorax</strong> hits, 1 <strong>head</strong> hit, 6 <strong>leg</strong> hits. You have a 97% chance to penetrate this AC on your first hit.
                                        </li>
                                        <li>
                                            AC 3 &nbsp;
                                            <Box
                                                component="span"
                                                sx={() => ({
                                                    backgroundColor: getEffectivenessColorCodeString("3.1.6 | 91%", 1),
                                                    borderRadius: '0.25rem',
                                                    color: '#fff',
                                                    maxWidth: '9ch',
                                                    p: '0.25rem',
                                                })}
                                            >
                                                <span>3.1.6 | 91%</span>
                                            </Box>
                                            &nbsp; You will usually kill on 3 <strong>thorax</strong> hits, 1 <strong>head</strong> hit, 6 <strong>leg</strong> hits. You have a 91% chance to penetrate this AC on your first hit.
                                        </li>
                                        <li>
                                            AC 4 &nbsp;
                                            <Box
                                                component="span"
                                                sx={() => ({
                                                    backgroundColor: getEffectivenessColorCodeString("6.3.6 | 13%", 1),
                                                    borderRadius: '0.25rem',
                                                    color: '#fff',
                                                    maxWidth: '9ch',
                                                    p: '0.25rem',
                                                })}
                                            >
                                                <span>6.3.6 | 13%</span>
                                            </Box>
                                            &nbsp; You will usually kill on 6 <strong>thorax</strong> hits, 3 <strong>head</strong> hits, 6 <strong>leg</strong> hits. You have a 13% chance to penetrate this AC on your first hit.
                                        </li>
                                        <li>
                                            AC 5 &nbsp;
                                            <Box
                                                component="span"
                                                sx={() => ({
                                                    backgroundColor: getEffectivenessColorCodeString("13.9.6 | 0%", 1),
                                                    borderRadius: '0.25rem',
                                                    color: '#fff',
                                                    maxWidth: '9ch',
                                                    p: '0.25rem',
                                                })}
                                            >
                                                <span>13.9.6 | 0%</span>
                                            </Box>
                                            &nbsp; You will usually kill on 13 <strong>thorax</strong> hits, 9 <strong>head</strong> hits, 6 <strong>leg</strong> hits. You have a 0% chance to penetrate this AC on your first hit.
                                        </li>
                                        <li>
                                            AC 6 &nbsp;
                                            <Box
                                                component="span"
                                                sx={() => ({
                                                    backgroundColor: getEffectivenessColorCodeString("15.10.6 | 0%", 1),
                                                    borderRadius: '0.25rem',
                                                    color: '#fff',
                                                    maxWidth: '9ch',
                                                    p: '0.25rem',
                                                })}
                                            >
                                                <span>15.10.6 | 0%</span>
                                            </Box>
                                            &nbsp; You will usually kill on 15 <strong>thorax</strong> hits, 10 <strong>head</strong> hits, 6 <strong>leg</strong> hits. You have a 0% chance to penetrate this AC on your first hit.
                                        </li>
                                    </ul>

                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        <strong>Multi-projectile</strong> rounds are displayed in "Shells to Kill", if you want to see the "Projectiles to Kill", check their tooltip. Number of projectiles is an available column. Remember that not all shot in a shell will hit, particularly at a distance.<br />
                        <strong>Please note:</strong>
                        <ul>
                            <li>Distance drop-off of damage and penetration is modeled, select it with the green distance numbers. Buckshot max is 50m, slugs and pistols max is 100m, intermediate rifles max is 200m, remainder max is 600m.</li>
                            <li>Armor Damage is in "effective durability" which is before any material modifiers, and in game this value is clamped to always do at least 1 durability point of damage eg: 1/40.</li>
                            <li>I've set fragmentation for ammo with less than 20 penetration to 0 to save you from having to cross check it and do it in your head, aren't I nice?</li>
                        </ul>
                    </>
                </Card.Body>
            </Card>
        </Col>
    )
}
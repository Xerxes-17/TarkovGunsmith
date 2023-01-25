import { Row, Col } from "react-bootstrap";

// Renders the home
export default function Home(props: any) {
    return (
        <Row className="justify-content-md-center">
            <Col md="auto">
                <h1 className="card-title">Welcome to Tarkov gunsmith!</h1>
                <br />
                <section className="about container">
                    <div className="row gy-0">
                        <div className="col-md-6 d-flex flex-column justify-content-center">

                            <div className="content">
                                <h2>Modded Weapon Builder</h2>
                                <img src={process.env.PUBLIC_URL + '/WeaponBuilderInfoPic.png'} className="img-fluid" alt='' />
                                <p>
                                    For many players of the hit looter-shooter Escape from Tarkov, the gunplay and
                                    gun modification is a major drawcard of the title. However with the complexity
                                    and variety that can be found with over a thousand Weapon Mods in game, making
                                    the best chocies can be a problem and many will wait for streamers and YouTube
                                    guides to show them how to build a weapon or in general. The purpose of the TWG
                                    is to allow a user to set a range of paramaters, such as the PMC level, and then
                                    recceive a build or a list of builds which fit this criteria.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-6 d-flex flex-column justify-content-center">
                            <div className="content">
                                <h2>Armor Damage Calculator</h2>
                                <img src={process.env.PUBLIC_URL + '/ArmorDamageInfoPic.png'} className="img-fluid" alt='' />
                                <p>
                                    Another area of obstufucated and somewhat arcane knowledge for the playerbase is
                                    how armor takes damage on hits from various bullets. After much testing it was
                                    worked out and now it can be easily looked up on this page.
                                </p>
                                <p>
                                    You can currently search by Armor name, Bullet name and set the starting
                                    durability of the armor. Select one of the results of each and then request
                                    the result.
                                </p>
                            </div>
                        </div>


                    </div>
                    <br/>
                    <div className="row gy-0">
                        <div className="col-md-6 d-flex flex-column justify-content-center">
                            <div className="content">
                                <h2>Datasheets</h2>
                                <img src={process.env.PUBLIC_URL + '/datas.png'} className="img-fluid" alt='' />
                                <p>
                                    Coming soon!
                                </p>
                                <p>
                                    There is of coruse a lot of data in Tarkov; ammo, armor, items, etc. I plan to provide
                                    pages with this info with .csv download allowed.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </Col>
        </Row>
    );
}
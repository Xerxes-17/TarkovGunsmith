import { Row, Col } from "react-bootstrap";

// Renders the home
export default function About(props: any) {
    return (
        <Row className="justify-content-md-center">
            <Col md="auto">

                <br />
                <section className="about container">
                    <div className="row gy-0">
                        <div className="col-lg d-flex flex-column justify-content-center">

                            <div className="content">
                                <h1 className="card-title">About Tarkov Wish Granter</h1>
                                <br />
                                <h2>FrontEnd</h2>
                                <p>
                                    The frontend of this website was made usinng React, TypeScript and Bootstrap. There are no accounts,
                                    as I don't wish to know or track anything about you, aside from it not being needed. User prefernces
                                    are kept local to them.
                                </p>
                                <h2>Backend</h2>
                                <p>
                                    The backend of this website is a C# webAPI utilizing the RatStash library created by Moritz.
                                    On that note he has been very helpful and this project would've taken a lot more time if
                                    he hadn't made RatStash, so big props to him!
                                </p>
                                <h2>Orchestration</h2>
                                <p>
                                    In order to show off my DevOps chops, I've setup this website to have CI/CD from a GitHub action
                                    with terraform and ansible scripts as the implementers.
                                </p>
                                <h2>Links</h2>
                                <ul>
                                    <li>Discord</li>
                                    <li>GitHub repo</li>
                                    <li>Tarkov Wiki</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </Col>
        </Row>
    );
}
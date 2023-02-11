import { Col, Card } from "react-bootstrap";

// Renders the home
export default function About(props: any) {
    return (
        <>
            <Col xl>
                <Card bg="dark" border="secondary" text="light" className="xl">

                    <Card.Header as="h3">
                        About Tarkov Gunsmith
                    </Card.Header>
                    <Card.Body>
                        <h4>Front End</h4>
                        <p>
                            The frontend of this website was made using functional React, TypeScript and <a href="https://react-bootstrap.github.io/">React-Bootstrap</a>.
                        </p>
                        <p>
                            There are no accounts,
                            as I don't wish to know or track anything about you, aside from it not being needed. I might add user preference cookies for things like saving builds, filters and etc later.
                        </p>

                        <h4>Back End</h4>
                        <p>
                            The backend of this website is a <a href="https://learn.microsoft.com/en-us/training/modules/build-web-api-minimal-api/">C# minimal API</a>  utilizing the <a href="https://github.com/RatScanner/RatStash">RatStash library</a> created by Moritz.
                        </p>
                        <p>
                            On that note he has been very helpful and responsive to any update requests and this project would've taken a lot more time if he hadn't made RatStash, so big props to him!
                        </p>
                        <h4>Orchestration</h4>
                        <p>
                            Currently have the FE CI/CD pipeline running, but still working on the BE. 😅
                        </p>

                        <h4>Links</h4>
                        <ul>
                            <li><a href="https://discord.gg/F7GZE4H7fq">📧 Discord</a></li>
                            <li><a href="https://github.com/Xerxes-17/TarkovGunsmith">📓 GitHub repo</a></li>
                            <li><a href="https://www.youtube.com/channel/UC2Kk3-weS6XZeJ4yDwiKKrA">📷 YouTube</a></li>
                            <li><a href="https://escapefromtarkov.fandom.com/wiki/Escape_from_Tarkov_Wiki">Tarkov Wiki</a></li>
                        </ul>
                    </Card.Body>
                </Card>
            </Col>
        </>
    );
}
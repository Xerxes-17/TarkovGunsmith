import { Row, Col } from "react-bootstrap"

const PageNotFound = () => {

    // Renders no page found page
    return (
        <Row className="justify-content-md-center">
            <Col sm="auto">
                <div className="form-container">
                    <div className="PageNotFound">
                        <h1>This page does not exist</h1>
                    </div>
                </div>
            </Col>
        </Row>
    );
}

export default PageNotFound;
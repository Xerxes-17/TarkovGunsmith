import { Form, Row, Col } from "react-bootstrap";

export default function FilterRangeSelector(props: any) {
    //props.label
    //props.value
    //props.changeValue
    //props.min
    //props.max
    return (
        <Form.Group className="mb-3">
            <Form.Label>{props.label}</Form.Label>
            <Row>
                <Col xs="9">
                    <Form.Range value={props.value} onChange={(e) => { props.changeValue(parseInt(e.target.value)) }} min={props.min} max={props.max} />
                </Col>
                <Col xs="3">
                    <Form.Control disabled value={props.value} onChange={(e) => { props.changeValue(parseInt(e.target.value)) }} min={props.min} max={props.max} />
                </Col>
            </Row>
        </Form.Group>
    );
}
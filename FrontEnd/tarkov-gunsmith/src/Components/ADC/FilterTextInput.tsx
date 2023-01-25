import { Form } from "react-bootstrap";

export default function FilterTextInput(props: any) {
    //props.label
    //props.value
    //props.id
    //props.name
    //props.onChange
    //props.hint

    /*
                                                <FilterTextInput
                                                label="Name Filter"
                                                value=""
                                                id="NameFilter"
                                                name="NameFilter"
                                                onchange={undefined}
                                                hint="This is a text filter. Eg, '7.62' would find any ammo with 7.62 in the name."
                                            />
    */

    // This isn't needed for the ADC, but could be used in the MWB
    return (
        <Form.Group className="mb-3">
            <Form.Label>{props.label}</Form.Label>
            <Form.Control
                value={props.value}
                type="TextFilter"
                id={props.id}
                name={props.name}
                onChange={props.onChange}
            />
            <Form.Text id={props.id + "HelpBlock"} muted>
                {props.hint}
            </Form.Text>
        </Form.Group>
    );
}
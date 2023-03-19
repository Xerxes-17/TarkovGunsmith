import { useEffect, useState } from 'react';
import { Col, Row, Stack } from 'react-bootstrap';
import Select from 'react-select'
import { AmmoOption } from './AmmoData';

export default function SelectAmmo(props: any) {
    const [item, setItem] = useState<AmmoOption>();
    // When we click on an item, we set the item (this render), we pass it to the parent, and we navigate to the page for history purposes.
    const handleClick = (selectedOption: any) => {
        setItem(selectedOption)
        props.handleAmmoSelection(selectedOption)

        //! Navigate needs to be passed in as a prop from the parent.
        //? We will do this as part of handleAmmoSelection.
    }
    // This useEffect sets the item according to the URL param ID if there is one
    useEffect(() => {
        //console.log("props.defaultSelection", props.defaultSelection)
        if (props.defaultSelection!) {
            setItem(props.defaultSelection)
        }
    }, [props.defaultSelection])

    return (
        <>
            <div className='black-text'>
                <Select
                    value={item}
                    required
                    placeholder="Select your ammo..."
                    className="selectorZIndexBodge"
                    classNamePrefix="select"
                    isClearable={true}
                    isSearchable={true}
                    name="selectAmmo"
                    options={props.ammoOptions}
                    formatOptionLabel={option => (
                        <Row>
                            <Col style={{ maxWidth: "75px" }}>
                                <img src={option.imageLink} alt={option.label} />
                            </Col>
                            <Col>
                                <span>{option.label}</span>
                                <Stack direction='horizontal' gap={1} style={{ flexWrap: "wrap" }}>
                                    <span style={{ minWidth: "55px" }}>⛏ PEN: {option.penetrationPower}</span>
                                    <span style={{ minWidth: "55px" }}>📏 AD%: {option.armorDamagePerc}</span>
                                    <span style={{ minWidth: "55px" }}>💀 DAM: {option.damage}</span>
                                    <span>👨‍🔧 TRDR:{option.traderLevel} </span>
                                </Stack>
                            </Col>
                        </Row>
                    )}
                    onChange={handleClick}
                />
            </div>
        </>
    )
}
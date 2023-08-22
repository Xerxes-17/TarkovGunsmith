import { useState } from "react";
import { Button, Modal } from "react-bootstrap";


/**
 * Provides a modal of info about the TBS, how nice.
 */
export default function TbsInfoModal() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button variant="info" onClick={handleShow}>
                Info
            </Button>

            <Modal show={show} onHide={handleClose} style={{ color: "black" }}>
                <Modal.Header closeButton>
                    <Modal.Title>Information - ADC</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Custom mode allows you to set the stats of the armor and ammo to whatever you want. The defaults are for RatRig vs 7.62x39 PS.</p>
                    <h5>Glossary:</h5>
                    <p><strong>🛡 Armor Class:</strong> How strong your armor can be.</p>
                    <p><strong>⛓ Max Durability:</strong> How tough your armor can be.</p>
                    <p><strong>⚖ Effective Durability:</strong> Durability divided by the armor material factor, allows you to compare the toughness of armors with different materials directly.</p>
                    <p><strong>⛏ Penetration:</strong> How well your bullet goes through armor.</p>
                    <p><strong>📐 Armor Damage Percentage:</strong> The percentage applied to penetration get armor damage, regular damage has nothing to do with it.</p>
                    <p><strong>💀 Damage:</strong> How much you will unalive someone on hits.</p>
                    <p><strong>👨‍🔧 Trader level:</strong> The trader level for a cash offer. 5 means it can be bought on flea market, 6 means found in raid only. -1 Means I broke something. <br />Note: the app does not account for barters yet.</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
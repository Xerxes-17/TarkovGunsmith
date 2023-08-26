import { Button, Modal } from "react-bootstrap";
import { useContext } from 'react';
import { MwbContext } from '../../Context/ContextMWB';


export default function InfoModalButton() {
    const {
        show,
        handleClose,
        handleShow,
    } = useContext(MwbContext);
    return (
        <>
            <Button variant="info" onClick={handleShow} style={{ marginBottom: "5px" }}>
                Info
            </Button>

            <Modal show={show} onHide={handleClose}>
                <div style={{ backgroundColor: "#2f3036" }} >
                    <Modal.Header closeButton>
                        <Modal.Title>Information - MWB</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <p>This tool will automatically build your selected weapon according to the selected parameters.</p>
                        <p>If you change the player level to one where the current weapon isn't available, it will be deselected.</p>
                        <p>You can search through the gun options by typing with the select input focused.</p>
                        <p>At the moment, weapons and modules are only available by Cash Offer from traders, this means no flea-market or barters.</p>
                        <p>
                            At the moment, you can select either a recoil or an ergo priority, and the other variable will be ignored.
                            The exception for this is muzzle breaks, which will always prioritize recoil for obvious reasons.
                            The cheapest option for the max effectiveness will also be chosen.
                        </p>
                        <p>You can select for a loud, silenced or either build. However do check if there is a silencer, as with certain level and weapon combos one might not be available.</p>
                        <p>If a mod has a cost of -1, it can only be bought as part of the default stock build/gun, for example, the AKS-74U hand guard or ADAR charging handle.</p>
                        <p>Optics, magazines and tactical devices aren't included as they are down to personal preference.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

        </>
    )
}
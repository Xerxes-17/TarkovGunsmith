import { MwbContextProvider } from "../../Context/ContextMWB";
import { MwbPageContent } from "./MwbPageContent";

export default function MwbBasePage(props: any) {
    return(
        <MwbContextProvider>
            <MwbPageContent />
        </MwbContextProvider>
    )
}

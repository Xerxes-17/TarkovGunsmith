import { MwbContextProvider } from "../../Context/ContextMWB";
import { SEO } from "../../Util/SEO";
import { MwbPageContent } from "./MwbPageContent";

export default function MwbBasePage(props: any) {
    return(
        <MwbContextProvider>
            <SEO url="https://tarkovgunsmith.com/moddedweaponbuilder" title={'Weapon Builder : Tarkov Gunsmith'} />
            <MwbPageContent />
        </MwbContextProvider>
    )
}

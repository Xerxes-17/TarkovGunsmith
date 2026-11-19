import { MwbContextProvider } from "./ContextMWB";
import { SEO } from "../../app/SEO";
import { MwbPageContent } from "./MwbPageContent";

export default function MwbBasePage(props: any) {
    return(
        <MwbContextProvider>
            <SEO url="https://tarkovgunsmith.com/moddedweaponbuilder" title={'Weapon Builder : Tarkov Gunsmith'} />
            <MwbPageContent />
        </MwbContextProvider>
    )
}

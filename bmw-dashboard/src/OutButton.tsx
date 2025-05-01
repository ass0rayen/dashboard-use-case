import { Button } from "@radix-ui/themes"
interface OutButtonProps{
    name:string
}
const OutButton = ({name}:OutButtonProps)=>{
    return(<>
            <Button color="indigo" variant="outline"> {name} </Button>
            </>)
}
export default OutButton;
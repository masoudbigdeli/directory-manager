import HomeWrapper,{ HeadersWrapper, BodyWrapper, StatusButtons } from "../../styles/pages/home";
import {  useCallback, useState } from "react";
import DirectoryRenderer from "../../components/directory-renderer";
import PlusIcon from "../../components/icons/plus-icon";
export interface directoryManager {
    id : string;
    name: string;
    children: Array<directoryManager>;
    layerIndex:number;

}
export default function Home() {
    const [ treeObject, setTreeObject ] = useState<directoryManager | null>(null);
    const handleOnEnter = useCallback((object:directoryManager) => {
        if (object.name === "__REMOVE__") {
            setTreeObject(null);
          } else {
            setTreeObject(object);
          }
    },[]);




  return (
    <HomeWrapper>
        <HeadersWrapper>
            <span>Directory Manager</span>
            {!treeObject 
            ? <StatusButtons onClick={(e) => {
                        setTreeObject({
                            id:crypto.randomUUID(),
                            name:e.currentTarget.value,
                            children:[],
                            layerIndex:0
                        })
                    }}>
                <PlusIcon/>
            </StatusButtons> 
            :null}
        </HeadersWrapper>
        <BodyWrapper>
        {treeObject && (
            <DirectoryRenderer 
                directory={treeObject}
                onEnterHandler={handleOnEnter} 
            />
            )}
        </BodyWrapper>
    </HomeWrapper>
  )
}

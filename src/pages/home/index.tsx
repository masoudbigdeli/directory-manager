import HomeWrapper,{ HeadersWrapper, BodyWrapper } from "../../styles/pages/home";
import {  useCallback, useState } from "react";
import DirectoryRenderer from "../../components/directory-renderer";
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
            {!treeObject ? <button onClick={(e) => {
                setTreeObject({
                    id:crypto.randomUUID(),
                    name:e.currentTarget.value,
                    children:[],
                    layerIndex:0
                })
            }}>ADD</button> :null}
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

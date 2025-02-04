import HomeWrapper,{HeadersWrapper, BodyWrapper, DirWrapper, DirNameWrapper} from "../../styles/pages/home";
import FolderIcon from "../../components/icons/folder-icon";
import Modal from "../../components/modal";
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
        setTreeObject(object)
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
  );
};

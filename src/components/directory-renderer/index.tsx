
import { useState, useCallback, useMemo } from "react";
import FolderIcon from "../../components/icons/folder-icon";
import FileIcon from "../../components/icons/file-icon";
import { DirNameWrapper, DirWrapper } from "../../styles/pages/home";
import AddDirectoryIcon from "../icons/add-directory-icon";
import RemoveIcon from "../icons/remove-icon";
import ArrowIcon from "../icons/arrow-icon";
import AddFileIcon from "../icons/add-file-icon";
import { StatusButtons, InputElement } from "../../styles/pages/home";


export interface DirectoryManager {
  id: string;
  name: string;
  children: Array<DirectoryManager | FileManager>;
  layerIndex: number;
  isExtended: boolean;
}
export interface FileManager {
  id: string;
  file: File | null;
  layerIndex: number;
}

interface DirectoryAndFileRendererProps {
  directoryOrFile: DirectoryManager | FileManager;
  onEnterHandler: (dirOrFile: DirectoryManager | FileManager) => void;
  checkDuplicate?: (name: string) => boolean;
}

const DirectoryAndFileRenderer: React.FC<DirectoryAndFileRendererProps> = ({
  directoryOrFile,
  onEnterHandler,
  checkDuplicate
}) => {

  const fieldChecker = Object.keys(directoryOrFile).includes('file') 
  ? (directoryOrFile as FileManager).file === null
  : (directoryOrFile as DirectoryManager).name ===''

  const [directoryTreeObject, setDirectoryTreeObject] = useState(directoryOrFile);
  const [isEditing, setIsEditing] = useState<boolean>(fieldChecker);
  const [inputValue, setInputValue] = useState("");

  const iconRotationHandler = useCallback(() => {
    if( Object.keys(directoryTreeObject).includes('isExtended') ){
    setDirectoryTreeObject({
      ...directoryTreeObject,
      isExtended: !(directoryTreeObject as DirectoryManager).isExtended,
    });
  }
  }, [directoryTreeObject]);

  const onEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const isValid = e.currentTarget.checkValidity();
        if (isValid && inputValue.trim() !== "") {
          const duplicateExists = checkDuplicate 
          ? checkDuplicate(inputValue.trim())
          : (directoryTreeObject as DirectoryManager).children.some(
                (child) => {
                  if (Object.keys(directoryTreeObject).includes('file')){
                   return (child as FileManager).file?.name === inputValue.trim()
                  }
                  else{
                    return (child as DirectoryManager).name === inputValue.trim()
                  }
                  
                } 
              );
          if (duplicateExists) {
            alert("It's duplicate name!");
            return;
          }
          if (Object.keys(directoryTreeObject).includes('file')) {
            setDirectoryTreeObject({
              ...directoryTreeObject,
              file: new File([],`${inputValue.trim()}.txt`),
            });
          } else{
            setDirectoryTreeObject({
              ...directoryTreeObject,
              name: inputValue.trim(),
              isExtended: true,
            });
          }

          setIsEditing(false);
          if (Object.keys(directoryTreeObject).includes('file')) {
            onEnterHandler({
              ...directoryTreeObject,
              file: new File([],`${inputValue.trim()}.txt`),
            });
          } else{
            onEnterHandler({
              ...directoryTreeObject,
              name: inputValue.trim(),
              isExtended: true,
            });
          }
        } else {
          alert("Please enter a folder name");
        }
      }
    },
    [directoryTreeObject, inputValue, onEnterHandler, checkDuplicate]
  );

  const addChild = (type: 'folder' | 'file') => {
    if ( Object.keys(directoryTreeObject).includes('file')) return
      if ( type === 'folder') {
        const newChild = {
          id: crypto.randomUUID(),
          name: "",
          children: [],
          layerIndex: directoryTreeObject.layerIndex + 1,
          isExtended: true,
        };
        setDirectoryTreeObject({
          ...directoryTreeObject,
          isExtended: true,
          children: [...(directoryTreeObject as DirectoryManager).children, newChild],
        });
      } else {
            const newFile = {
              id: crypto.randomUUID(),
              layerIndex: directoryTreeObject.layerIndex + 1,
              file: null,
            }
          setDirectoryTreeObject({
            ...directoryTreeObject,
            children: [...(directoryTreeObject as DirectoryManager).children, newFile],
          });
      }
    };

  const removeSelf = () => {
    if ( Object.keys(directoryTreeObject).includes('file')) {
      if ((directoryTreeObject as FileManager).file) {
        onEnterHandler({
        ...directoryTreeObject,
        file: new File([(directoryTreeObject as FileManager).file!], '__REMOVE__'),
      });
      }
    } else {
      onEnterHandler({ ...directoryTreeObject, name: "__REMOVE__" });
    };
    
  };

  const feildName = useMemo(() =>{
    if (Object.keys(directoryTreeObject).includes('file')){
      return (directoryTreeObject as FileManager).file?.name
    } else {
      return (directoryTreeObject as DirectoryManager).name
    }
  },[directoryTreeObject])

  return (
    <div style={{ marginLeft: directoryTreeObject.layerIndex * 20 }}>
      {isEditing ? (
        <InputElement
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onEnter}
          autoFocus
        />
      ) : (
        <DirWrapper>
          <DirNameWrapper>
            <div className="icon" onClick={iconRotationHandler}>
              {Object.keys(directoryTreeObject).includes('isExtended') && (directoryTreeObject as DirectoryManager).children.length !== 0 ? (
                <ArrowIcon rotated={(directoryTreeObject as DirectoryManager).isExtended} />
              ): <div style={{width:'1.5rem'}}></div>}
              {Object.keys(directoryTreeObject).includes('isExtended')
              ?<FolderIcon width={1.3} />
              : <FileIcon/>}
            </div>
            <div className="title">
              <span>{feildName}</span>
            </div>
            {Object.keys(directoryTreeObject).includes('isExtended')
            ?<>            
                <StatusButtons onClick={() => addChild('folder')}>
                <AddDirectoryIcon />
                </StatusButtons>
                <StatusButtons onClick={removeSelf}>
                  <RemoveIcon />
                </StatusButtons>
                <StatusButtons onClick={() => addChild('file')}>
                  <AddFileIcon />
                </StatusButtons>
              </>
              :         
                <StatusButtons onClick={removeSelf}>
                <RemoveIcon />
                </StatusButtons>
            }
          </DirNameWrapper>
        </DirWrapper>
      )}

      <div
        style={{ display: (directoryTreeObject as DirectoryManager).isExtended ? "block" : "none" }}
      >
        {Object.keys(directoryTreeObject).includes('isExtended') && (directoryTreeObject as DirectoryManager).children.map((child) => {
          return (
            <DirectoryAndFileRenderer
              key={child.id}
              directoryOrFile={child}
              onEnterHandler={(updatedChild) => {
                console.log((updatedChild as FileManager).file?.name)
                if ((updatedChild as DirectoryManager).name === "__REMOVE__" || (updatedChild as FileManager).file?.name === "__REMOVE__") {
                  setDirectoryTreeObject({
                    ...directoryTreeObject,
                    children: (directoryTreeObject as DirectoryManager).children.filter(
                      (c) => c.id !== child.id
                    ),
                  });
                } else {
                  setDirectoryTreeObject({
                    ...directoryTreeObject,
                    children: (directoryTreeObject as DirectoryManager).children.map((c) =>
                      c.id === updatedChild.id ? updatedChild : c
                    ),
                  });
                }
              }}
              checkDuplicate={(name: string) => {
                return (directoryTreeObject as DirectoryManager).children.some(
                (child) => {
                  if (Object.keys(directoryTreeObject).includes('file')){
                    return (child as FileManager).file?.name === name
                  }
                  else{
                    return (child as DirectoryManager).name === name
                  }
                  
                } 
              );
            }
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default DirectoryAndFileRenderer;

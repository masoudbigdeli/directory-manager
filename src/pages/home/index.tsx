import { useCallback, useState } from "react";
import HomeWrapper, {
  MenuWrapper,
  TextAreaWrapper,
  EditorWrapper,
  Button,
  HeadersWrapper,
  BodyWrapper,
  StatusButtons,
} from "../../styles/pages/home";
import DirectoryAndFileRenderer, {
  DirectoryManager,
  FileManager,
} from "../../components/directory-renderer";
import PlusIcon from "../../components/icons/add-directory-icon";

export default function Home() {
  // Central state holds the entire tree.
  const [treeObject, setTreeObject] = useState<DirectoryManager | FileManager | null>(null);
  const [textValue, setTextValue] = useState("");
  // Track which file (by id) is currently open.
  const [openFileId, setOpenFileId] = useState<string | null>(null);

  // When a change occurs in the tree, update the central state.
  const handleOnEnter = useCallback((node: DirectoryManager | FileManager) => {
    if (
      ("name" in node && node.name === "__REMOVE__") ||
      ("file" in node && node.file?.name === "__REMOVE__")
    ) {
      setTreeObject(null);
    } else {
      setTreeObject(node);
    }
  }, []);

  const handleFileContentChange = useCallback((newContent: string) => {
    setTextValue(newContent);
  }, []);

  const updateFileInTree = useCallback(
    (node: DirectoryManager | FileManager): DirectoryManager | FileManager => {
      if ("file" in node) {
        if (node.id === openFileId && node.file) {
          const fileName = node.file.name;
          const updatedFile = new File([textValue], fileName, { type: "text/plain" });
          return { ...node, file: updatedFile };
        }
        return node;
      } else {
        return {
          ...node,
          children: node.children.map((child) => updateFileInTree(child)),
        };
      }
    },
    [openFileId, textValue]
  );

  const handleSave = useCallback(() => {
    if (treeObject && openFileId) {
      const updatedTree = updateFileInTree(treeObject);
      setTreeObject(updatedTree);
      alert(`File changes saved! (Open File ID: ${openFileId})`);
    } else if (treeObject && "file" in treeObject && treeObject.file) {
      const fileName = treeObject.file.name;
      const updatedFile = new File([textValue], fileName, { type: "text/plain" });
      setTreeObject({ ...treeObject, file: updatedFile });
      alert(`${fileName} changes saved! :)`);
    } else {
      alert("No file is currently open to save.");
    }
  }, [treeObject, openFileId, textValue, updateFileInTree]);

  return (
    <HomeWrapper>
      <MenuWrapper>
        <HeadersWrapper>
          <span>Directory Manager</span>
          {!treeObject && (
            <StatusButtons
              onClick={(e) => {
                setTreeObject({
                  id: crypto.randomUUID(),
                  name: e.currentTarget.value,
                  children: [],
                  layerIndex: 0,
                  isExtended: true,
                });
              }}
            >
              <PlusIcon />
            </StatusButtons>
          )}
        </HeadersWrapper>
        <BodyWrapper>
          {treeObject && (
            <DirectoryAndFileRenderer
              directoryOrFile={treeObject}
              onEnterHandler={handleOnEnter}
              fileContent={textValue}
              onFileContentChange={handleFileContentChange}
              onFileOpen={(fileId: string) => setOpenFileId(fileId)}
            />
          )}
        </BodyWrapper>
      </MenuWrapper>
      <EditorWrapper>
        <TextAreaWrapper
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        />
        <Button
          style={{
            border: "2px solid rgba(22, 21, 21, 0.24)",
            width: "4rem",
            backgroundColor: "#009c82",
            borderRadius: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            float: "right",
            padding: "0.75rem",
            margin: "0.3rem",
            cursor: "pointer",
          }}
          onClick={handleSave}
        >
          <span style={{ color: "rgb(30, 59, 155)", fontSize: "1rem" }}>
            Save
          </span>
        </Button>
      </EditorWrapper>
    </HomeWrapper>
  );
}

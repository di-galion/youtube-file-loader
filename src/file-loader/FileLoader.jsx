import className from "classnames"
import { useEffect, useRef, useState } from "react"
import { FaRegFile, FaRegFileAlt } from "react-icons/fa"
import { IoTrashOutline } from "react-icons/io5"
import { ERROR_FILE_EXIST, ERROR_NO_LOADED } from './constants/file-loader.constant'
import "./styles.scss"
import { formatFileName, getQuantityError, getSizeError } from "./utils/file-loader.utils"

const MAX_QUANTITY = 2
const SIZE_MB = 5

const FileLoader = (
  {
    maxQuantity = MAX_QUANTITY,
    size = SIZE_MB,
    onDrop = () => {},
    onWindowDrop,
  }
) => {
  const inputRef = useRef(null)

  const [files, setFiles] = useState([])
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState("")

  const onClickInputHandler = () => {
    setError("")
    inputRef.current.click()
  }

  const onChangeInputHandler = (e) => {
    checkIsValidFiles(e.target.files)
  }
  
  const onClickDeleteIconHandler = (name, size) => {
      const filteredFiles = files.filter((file) => file.name + file.size !== name + size)

      inputRef.current.value = ""

      setFiles(filteredFiles)
  }

  const checkIsFileExist = (file) => {
    return !!files.filter((f) => {
      return f.name + f.size === file.name + file.size
    }).length
  }

  const checkIsValidFiles = (filesNew) => {
    const filesSum = [...files, ...filesNew]
    const filesArray = [...filesNew]

    let isExist = false
    filesArray.forEach(file => {
      if(checkIsFileExist(file)) isExist = true
    })
    if (isExist) {
      setError(ERROR_FILE_EXIST)
      return 
    }

    if (filesSum.length > maxQuantity) {
      setError(getQuantityError(maxQuantity))
      return
    } else if (!filesSum.length) {
      setError(ERROR_NO_LOADED)
      return 
    }

    if (size) {
      let isSizeValid = true
      filesArray.forEach(file => {
        if (file.size > size * 1000000 ) {
          isSizeValid = false
          setError(getSizeError(size))
        }
      })
      if (!isSizeValid) return
    }

    inputRef.current.value = ""

    setFiles(filesSum)
  }
  const dragStatHandler = (e) => {
    e.preventDefault()
    setDrag(true)
    setError("")
  }
  const dragLeaveHandler = (e) => {
    e.preventDefault()
    setDrag(false)
  }
  const onDropHandler = (e) => {
    e.preventDefault()
    setDrag(false)
    checkIsValidFiles(e.dataTransfer.files)
  }

  useEffect(() => {
    onDrop(files)
  }, [files, onDrop])

  useEffect(() => {
    if (onWindowDrop) {
      document.addEventListener("dragstart", dragStatHandler)
      document.addEventListener("dragover", dragStatHandler)
      document.addEventListener("dragleave", dragLeaveHandler)
      document.addEventListener("drop", onDropHandler)

      return function() {
        document.removeEventListener("dragstart", dragStatHandler)
        document.removeEventListener("dragover", dragStatHandler)
        document.removeEventListener("dragleave", dragLeaveHandler)
        document.removeEventListener("drop", onDropHandler)
      }
    }
  }, [])

  return (
    <div 
      onDragStart={dragStatHandler}
      onDragOver={dragStatHandler}
      onDragLeave={dragLeaveHandler}
      onDrop={onDropHandler}
      className="loader"
    >
      <input 
        onChange={onChangeInputHandler}
        className="input"
        ref={inputRef}
        type="file"
       />
       {drag &&
        <div 
          className={"drag"}
        >
          <div className={"dragtext"}>
            Отпустите файл, чтобы загрузить
          </div>
        </div>
       }
       <div>
        <div 
          onClick={onClickInputHandler}
          className="flex_main"
        >
         <FaRegFile 
          className={className("text", {
            ["errortext"]: !!error
          })}
         />
          <div className={className("text", {
            ["errortext"]: !!error
          })}>
              Прикрепите файл
          </div>
        </div>
        {!!size &&
        <div className="flex">
            <div 
              className="subtext"
            >
              {size} Мб максимум
            </div>
            {!!error &&
              <div
                className="error"
              >
                {error}
              </div>
            }
        </div>
        }
       </div>
       {!!files.length &&
       <div className="files">
          {files.map((file, index) => {
            return (
              <div 
                key={index}
                className={className("flex", "file")}
              >
                <FaRegFileAlt />
                <div>{formatFileName(file.name)}</div>
                  <IoTrashOutline
                    className={'trashicon'}
                    onClick={() => {
                      onClickDeleteIconHandler(file.name, file.size)
                    }}
                  />
              </div>
            )
          })}
       </div>
       }
    </div>
  )
}

export default FileLoader
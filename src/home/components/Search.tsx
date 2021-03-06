import styles from './Search.module.scss'
import { useRecoilState } from 'recoil'
import { inputTextAtom, isLoadingAtom, movieListAtom, pageNumberAtom, maxPageAtom } from 'common/atom/Atom'
import React, { useCallback, useEffect, useState } from 'react'
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai'
import axios from 'axios'

const Search = () => {
  const [text, setText] = useState('')

  const [page] = useRecoilState(pageNumberAtom)
  const [inputText, setInputText] = useRecoilState(inputTextAtom)
  const [, setMovieList] = useRecoilState(movieListAtom)
  const [, setIsLoading] = useRecoilState(isLoadingAtom)
  const [maxPage, setMaxPage] = useRecoilState(maxPageAtom)

  //  api call function

  const getMovieData = useCallback(
    (movieName: string, pageNumber: number) => {
      setIsLoading(true)
      if (movieName === '') {
        setMovieList([])
        return
      }
      const url = `https://www.omdbapi.com/?apikey=7c1fab90`
      if (page <= maxPage) {
        axios
          .get(url, {
            params: {
              s: movieName,
              page: pageNumber,
            },
          })
          .then((res) => {
            if (res.data.Response === 'True') {
              setMovieList((prev) => [...prev, ...res.data.Search])
              setMaxPage(Math.ceil(res.data.totalResults / 10))
            } else {
              setMovieList([])
            }
          })
      }

      setIsLoading(false)
    },
    [maxPage, page, setIsLoading, setMaxPage, setMovieList]
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMovieList([])
    setInputText(text)
    setText('')
  }

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value)
  }

  useEffect(() => {
    if (inputText === '') return
    getMovieData(inputText, page)
  }, [getMovieData, inputText, page])

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <AiOutlineSearch className={styles.searchIcon} />
        <form action='submit' onSubmit={handleSubmit}>
          <input className={styles.searchInput} type='text' value={text} onChange={handleChange} />
        </form>
        <AiOutlineClose className={styles.closeIcon} />
      </div>
    </div>
  )
}

export default Search

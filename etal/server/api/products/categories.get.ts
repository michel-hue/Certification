import { listCategories } from '../../adapters/dummyjson/catalog'

export default defineCachedEventHandler(
  async (event) => {
    const { client } = useCatalogApi(event)
    try {
      return await listCategories(client)
    } catch (error) {
      throw toHttpError(error)
    }
  },
  { maxAge: 60 * 60, swr: true, name: 'categories' },
)

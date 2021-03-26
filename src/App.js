import Dexie from 'dexie'
import { useEffect, useState } from 'react'
import './App.css'

const App = () => {
  const database = new Dexie('MarketList')
  database.version(1).stores(
    { items: "++id,name,price,itemHasBeenPurchased" }
  )

  const [allItems, setAllItems] = useState()

  useEffect(() => database.items.toArray()
    .then(result => {
      setAllItems(result)
    }), [allItems, database.items]
  )

  const addItemToDb = async event => {
    event.preventDefault()
    const name = document.querySelector('.item-name').value
    const price = document.querySelector('.item-price').value
    const itemObject = {
      name, price, itemHasBeenPurchased: false
    }

    await database.items.add(itemObject)
    const newItemList = await database.items.toArray()
    setAllItems(newItemList)
  }

  const removeItemFromDb = async id => {
    await database.items.delete(id)
    const newItemList = await database.items.toArray()
    setAllItems(newItemList)
  }

  const markAsPurchased = async (id, event) => {
    if (event.target.checked) {
      await database.items.update(id, {itemHasBeenPurchased: true})
      const newItemList = await database.items.toArray()
      setAllItems(newItemList)
    }
    else {
      await database.items.update(id, {itemHasBeenPurchased: false})
      const newItemList = await database.items.toArray()
      setAllItems(newItemList)
    }
  }

  const itemData = allItems?.map(({ id, name, price, itemHasBeenPurchased }) => (
    <div className="row" key={id}>
      <p className="col s5">
        <label>
          <input
            type="checkbox"
            checked={itemHasBeenPurchased}
            onChange={event => markAsPurchased(id, event)}
          />
          <span className="black-text">{name}</span>
        </label>
      </p>
      <p className="col s5">${price}</p>
      <i onClick={() => removeItemFromDb(id)} className="col s2 material-icons delete-button">
        delete
      </i>
    </div>
  ))

  return (
    <div className="container">
      <h3 className="green-text center-align">Market List App</h3>
      <form className="add-item-form" onSubmit={addItemToDb}>
        <input type="text" className="item-name" placeholder="Name of item" required />
        <input type="number" className="item-price" placeholder="Price in USD" required />
        <button type="submit" className="waves-effect waves-light btn right">Add item</button>
      </form>
      {allItems?.length > 0 &&
        <div className="card white darken-1">
          <div className="card-content">
            <form action="#">
              { itemData }
            </form>
          </div>
        </div>
      }
    </div>
  )
}

export default App

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ProductForm = () => {
  const allProducts = [
    { value: 'product1', label: 'Product 1' },
    { value: 'product2', label: 'Product 2' },
    { value: 'product3', label: 'Product 3' },
    { value: 'product4', label: 'Product 4' },
    { value: 'product5', label: 'Product 5' },
  ];

  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const { handleSubmit } = useForm({
    defaultValues: {
      flags: {},
      isFeatured: false,
      featuredRanking: "",
      featuredDisplayLocation: "",
      isNewArrival: false,
      newArrivalRanking: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("onSubmit function started");
    try {
      const formData = new FormData();
      formData.append("metaTitle", data.metaTitle);
      formData.append(
        "recommendedProducts",
        JSON.stringify(recommendedProducts.map((prod, index) => ({
          id: prod.value,
          ranking: index + 1
        })))
      );
      console.log("Form data:", Object.fromEntries(formData));
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  const handleRecommendedProductsDragEnd = useCallback((result) => {
    if (!result.destination) return;

    setRecommendedProducts(prevProducts => {
      const items = Array.from(prevProducts);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      return items.map((item, index) => ({ ...item, ranking: index + 1 }));
    });
  }, []);

  const handleProductSelect = useCallback((selectedOptions) => {
    setRecommendedProducts(selectedOptions.map((option, index) => ({
      ...option,
      ranking: index + 1
    })));
  }, []);

  return (

    <DragDropContext onDragEnd={() => {}}>
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto mt-8">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recommended Products
        </label>
        <Select
          options={allProducts}
          isMulti
          value={recommendedProducts}
          onChange={handleProductSelect}
          className="mb-2"
          placeholder="Select Recommended Products (optional)"
        />
        <DragDropContext onDragEnd={handleRecommendedProductsDragEnd}>
          <Droppable droppableId="recommendedProducts">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="mt-2 border border-gray-300 rounded-md p-2"
              >
                {recommendedProducts.map((product, index) => (
                  <Draggable key={product.value} draggableId={product.value} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between p-2 bg-gray-100 rounded-md mb-2"
                      >
                        <div className="flex items-center">
                          <span className="mr-2 font-semibold">{product.ranking}.</span>
                          <span>{product.label}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setRecommendedProducts(prev =>
                              prev.filter((_, i) => i !== index).map((item, i) => ({ ...item, ranking: i + 1 }))
                            );
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          &#x2715;
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Product
        </button>
      </div>
    </form>
    </DragDropContext>
  );
};

export default ProductForm;

    
    
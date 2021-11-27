import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { supabase } from "./../../util/supabase_client";
import { MdDelete, MdAddCircle } from "react-icons/md";
import { SiCkeditor4 } from "react-icons/si";
import { RiSendPlaneFill } from "react-icons/ri";
import { FaMinusSquare } from "react-icons/fa";
import { GoPrimitiveDot } from "react-icons/go";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function AddEntry() {
  const [count, setCount] = useState(0);
  const [types, setTypes] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const { register, control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      title: '',
      tags: [],
      content: []
    }
  });

  const {
    fields: contentFields,
    remove: contentRemove,
    append: contentAppend,
    move: contentMove
  } = useFieldArray({
    name: "content",
    control
  });

  const {
    fields: tagFields,
    remove: tagRemove,
    append: tagAppend
  } = useFieldArray({
    name: "tags",
    control
  });

  const getElementTypes = async () => {
    let { data, error, status } = await supabase
      .from('elements')
      .select('*');
    if (error) console.error(error);
    if (status === 200) setTypes(data || []);
  }

  const getBlogData = async () => {
    let { data, error, status } = await supabase
      .from('blogs')
      .select('*, blog_content(*, contents(*, elements(*))), blog_tag(*, tags(*))');
    if (error) console.error(error);
    if (status === 200) console.log(data);
  }

  useEffect(() => {
    getElementTypes();
    getBlogData()
  }, []);

  const saveBlog = async (title) => {
    let { data, error, status } = await supabase
      .from('blogs')
      .insert([{
        title
      }]);
    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    if (status === 201) return { blog_id: data[0]?.id };
  }

  const tagExistsWithTagname = async (tagName) => {
    let { data, error, status } = await supabase
      .from('tags')
      .select('*')
      .match({ name: tagName });

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    let exist = status === 200 && data.length !== 0;
    if (exist) {
      return {
        exist,
        ...data[0]
      };
    } else return {
      exist,
      name: tagName
    }
  }

  const saveTags = async (tags) => {
    tags = [...new Set(tags)];
    const results = await Promise.all(tags.map(tag => tagExistsWithTagname(tag)));
    let { data, error, status } = await supabase
      .from('tags')
      .insert(results.filter(tag => !tag.exist).map(tag => Object.freeze({ name: tag.name })));

    results = results.filter(tag => tag.exist).map(tag => Object.freeze({ id: tag.id, name: tag.name }))

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    if (status === 201) return [...data, ...results];
  }

  const saveBlogAndTagsMapping = async ({ blog_id, tag_ids }) => {
    let { data, error, status } = await supabase
      .from('blog_tag')
      .insert(tag_ids.map(tag_id => Object.freeze({ blog_id, tag_id })));

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    if (status === 201) return data;
  }

  const saveContent = async (contents) => {
    let { data, error, status } = await supabase
      .from('contents')
      .insert(contents.map(content=>({ ...content, element_id: Number(content.element_id) })));

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    if (status === 201) return data;
  }

  const saveBlogAndContentMappings = async({ blog_id, content_ids }) => {
    let { data, error, status } = await supabase
      .from('blog_content')
      .insert(content_ids.map(content_id => Object.freeze({ blog_id, content_id })));

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    if (status === 201) return data;
  }

  const onSubmit = async (data) => {
    try {
      const { blog_id } = await saveBlog(data.title);
      const tag_ids = await saveTags(data.tags.map(tag => tag.value))
        .then(res => res.map(({ id }) => id));
      await saveBlogAndTagsMapping({ blog_id, tag_ids });
      const content_ids = await saveContent(data.content).then(res => res.map(({ id }) => id));
      await saveBlogAndContentMappings({ blog_id, content_ids });
      console.log('done');
    } catch (e) {
      console.error(e);
    }
  }

  const handleEnd = (result) => {
    if (!result.destination) return; //if no destination exits(cancel event), exit this function
    contentMove(result.source.index, result.destination.index);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      tagAppend({ value: e.target.value });
      e.target.value = '';
    }
  }

  const checkKeyDown = (e) => {
    if (e.code === 'Enter') e.preventDefault();
  };

  return (
    <div className={`add-entry-form-wrapper`}>
      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)}>
        <DragDropContext onDragEnd={handleEnd}>
          <div>
            <div className="entry-form-control">
              <div className="form-title">TITLE</div>
              <input
                type="text"
                {...register(`title`)}
                className="entry-form-input"
              />
            </div>
            <div className="entry-form-control">
              <div className="form-title">TAGS</div>
              <div className="tags-container">
                {
                  tagFields.map((field, index) => {
                    return (
                      <div key={field.id} className="tag-wrapper">
                        {field.value} <button type="button" onClick={() => tagRemove(index)}>X</button>
                      </div>
                    )
                  })
                }
              </div>
              <input
                type="text"
                className="entry-form-input"
                onKeyDown={handleKeyDown}
              />
            </div>
            <Droppable droppableId="to-dos">
              {(provided) => (
                <div className={`dynamic-form-entries`} {...provided.droppableProps} ref={provided.innerRef}>
                  {contentFields.map((field, index) => {
                    return (
                      <Draggable
                        key={field.id}
                        draggableId={field.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`entry-form-control ${snapshot.isDragging ? "selected" : "not-selected"}`}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                          >
                            <div
                              className="drag-handle"
                            >
                              {
                                Array.from(Array(10).keys()).map((el, index) => (<GoPrimitiveDot key={index} color="var(--primary-2)" size={10} />))
                              }
                            </div>
                            <div className="dynamic-form-entry-select">
                              <div className="form-entry-select">
                                <div className="form-entry-select-icon"> <SiCkeditor4 color="skyblue" /> </div>
                                <select name="types" id="entry-type" {...register(`content.${index}.element_id`)} placeholder="SELECT TYPE">
                                  <option disabled>Select the type of entry.</option>
                                  {
                                    types.map((type, index) => (
                                      <option key={type.id || index} value={type.id}>{type.type.replace('_', ' ')}</option>
                                    ))
                                  }
                                </select>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  contentRemove(index)
                                }}
                              >
                                <FaMinusSquare size={20} color="red" />
                              </button>
                            </div>
                            <div>
                              {
                                ['IMAGE', 'LINK', 'THUMBNAIL'].includes(watch("content")[index]?.type) ?
                                  <input
                                    type="text"
                                    defaultValue={field.value}
                                    {...register(`content.${index}.value`)}
                                    className="entry-form-input"
                                  /> :
                                  <textarea
                                    defaultValue={field.value}
                                    {...register(`content.${index}.value`)}
                                    className="entry-form-input"
                                  />
                              }
                            </div>
                          </div>
                        )}

                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
        <div className="buttons-wrapper">
          <button type="submit" className="entry-field-button">
            <RiSendPlaneFill size={20} color="darkblue" />
          </button>
          <button
            type="button"
            onClick={() => {
              setCount(count++);
              contentAppend({
                value: "",
                element_id: '1'
              })
            }}
            className="entry-field-button"
          >
            <MdAddCircle size={30} color="rgb(59, 202, 95)" />
          </button>
          <button type="submit" className="entry-field-button" onClick={() => reset()}>
            <MdDelete size={20} color="red" />
          </button>
        </div>
      </form>
    </div>
  )
}
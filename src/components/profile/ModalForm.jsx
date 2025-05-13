// components/ModalForm.jsx
import React from "react";
import Modal from "../forms/modal/Modal";
import styles from "./ModalForm.module.scss";
import { useState, useEffect } from "react";
export default function ModalForm({
    show,
    title,
    fields,
    initialData,
    onSave,
    onCancel,
    saveLabel   = "Сохранить",
    cancelLabel = "Отменить"
  }) {
    const [form, setForm] = useState({});
  
    useEffect(() => {
      if (show) {
        setForm(initialData || {});
      }
    }, [show, initialData]);
  
    const handleChange = e => {
      const { name, value, type, checked } = e.target;
      setForm(f => ({
        ...f,
        [name]: type === "checkbox" ? checked : value
      }));
    };
  
    const handleSubmit = e => {
      e.preventDefault();
      onSave(form);
    };
  
    if (!show) return null;
  
    return (
      <Modal show={show} onClose={onCancel} title={title}>
        <div className={styles.profileContainer}>
          <div className={styles.profileEditForm}>
            <h2>{title}</h2>
            <form onSubmit={handleSubmit}>
              {fields.map(f => (
                <div key={f.name} className={styles.formGroup}>
                  <label>{f.label}</label>
  
                  {f.type === "select" ? (
                    <select
                      name={f.name}
                      value={form[f.name] ?? ""}
                      onChange={handleChange}
                      required={f.required}
                    >
                      <option value="">—</option>
                      {f.options.map(o => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
  
                  ) : f.type === "textarea" ? (
                    <textarea
                      name={f.name}
                      value={form[f.name] ?? ""}
                      onChange={handleChange}
                      required={f.required}
                    />
  
                  ) : (
                    <input
                      type={f.type}
                      name={f.name}
                      value={form[f.name] ?? ""}
                      onChange={handleChange}
                      required={f.required}
                    />
                  )}
                </div>
              ))}
  
              <div className={styles.formButtons}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={onCancel}
                >
                  {cancelLabel}
                </button>
                <button type="submit" className={styles.saveButton}>
                  {saveLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    );
  }
  
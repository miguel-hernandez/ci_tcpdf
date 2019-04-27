<?php


class Centrocfg_model extends CI_Model {

    function __construct() {
        parent::__construct();
        $this->load->library('UtilsWrapper');

    }

    /*
     * Get centrocfg by idcentrocfg
     */

    function get_centrocfg($idcentrocfg) {
        return $this->db->get_where('centrocfg', array('idcentrocfg' => $idcentrocfg))->row_array();
    }
    function get_centrocfg_sup($idct)
    {
        return $this->db->get_where('centrocfg', array('idct' => $idct))->row_array();
    }

    /*
     * Get all centrocfg
     */

    function get_all_centrocfg() {
        return $this->db->get('centrocfg')->result_array();
    }

    /*
     * function to add new centrocfg
     */

    function add_centrocfg($params) {
        $this->db->insert('centrocfg', $params);
        return $this->db->insert_id();
    }

    /*
     * function to update centrocfg
     */

    function update_centrocfg($idcentrocfg, $params) {
        $this->db->where('idcentrocfg', $idcentrocfg);

        $response = $this->db->update('centrocfg', $params);
        if ($response) {
            return "centrocfg updated successfully";
        } else {
            return "Error occuring while updating centrocfg";
        }
    }

    /*
     * function to delete centrocfg
     */

    function delete_centrocfg($idcentrocfg) {
        $response = $this->db->delete('centrocfg', array('idcentrocfg' => $idcentrocfg));
        if ($response) {
            return "centrocfg deleted successfully";
        } else {
            return "Error occuring while deleting centrocfg";
        }
    }

    function get_grupos_centrocfg($idcfg=0,$idusuario=0) {
        $this->db->select('centrocfg.idcentrocfg,centrocfg.idct,centrocfg.turno, centrocfg.nivel,
        cct.cct,
        grupo_pree.idgrupo as preidgrupo, grupo_pree.grupo as pregrupo, grupo_pree.grado as pregrado,
        grupo_prim.idgrupo as priidgrupo, grupo_prim.grupo as prigrupo, grupo_prim.grado as prigrado,
        grupo_sec.idgrupo as secidgrupo, grupo_sec.grupo as secgrupo, grupo_sec.grado as secgrado,
        grupoxusuario.idgrupo_pree, grupoxusuario.idgrupo_prim, grupoxusuario.idgrupo_sec');
        $this->db->from('centrocfg');
        $this->db->join('cct', 'cct.idct=centrocfg.idct', 'inner');
        $this->db->join('grupo_pree', 'grupo_pree.idcentrocfg = centrocfg.idcentrocfg', 'left');
        $this->db->join('grupo_prim', 'grupo_prim.idcentrocfg = centrocfg.idcentrocfg', 'left');
        $this->db->join('grupo_sec', 'grupo_sec.idcentrocfg = centrocfg.idcentrocfg', 'left');
        $this->db->join('grupoxusuario', '(grupo_pree.idgrupo=grupoxusuario.idgrupo_pree OR grupo_prim.idgrupo=grupoxusuario.idgrupo_prim OR grupo_sec.idgrupo=grupoxusuario.idgrupo_sec)', 'left');
        $this->db->where(" grupoxusuario.idusuario='.$idusuario.' and cct.`status`=1 and (grupo_pree.`status`=1 OR grupo_prim.`status`=1 OR grupo_sec.`status`=1) AND centrocfg.idcentrocfg=$idcfg "); // Produces: WHERE name = 'Joe'
        $this->db->order_by('grupo_prim.grado,  grupo_pree.grado, grupo_sec.grado, grupo_prim.grupo, grupo_pree.grupo,grupo_sec.grupo', 'ASC');
        $rows=$this->db->get()->result_array();
        //echo $this->db->last_query();

        //$query = $this->db->get();
        //echo $query;
        return $rows;
    }

    function get_todos_grupos_centrocfg($idcfg=0) {
        $str_query = "SELECT  distinct
           `centrocfg`.`idcentrocfg`,
           `centrocfg`.`idct`,
           `centrocfg`.`turno`,
           `centrocfg`.`nivel`,
           `cct`.`cct`,
           `grupo_pree`.`idgrupo` AS `preidgrupo`,
           `grupo_pree`.`grupo` AS `pregrupo`,
           `grupo_pree`.`grado` AS `pregrado`,
           `grupo_prim`.`idgrupo` AS `priidgrupo`,
           `grupo_prim`.`grupo` AS `prigrupo`,
           `grupo_prim`.`grado` AS `prigrado`,
           `grupo_sec`.`idgrupo` AS `secidgrupo`,
           `grupo_sec`.`grupo` AS `secgrupo`,
           `grupo_sec`.`grado` AS `secgrado`,
           `grupo_pree`.`idgrupo` as `idgrupo_pree`,
           `grupo_prim`.`idgrupo` as `idgrupo_prim`,
           `grupo_sec`.`idgrupo` as `idgrupo_sec`
        FROM
           `centrocfg`
               INNER JOIN  `cct` ON `cct`.`idct` = `centrocfg`.`idct`
               LEFT JOIN     `grupo_pree` ON `grupo_pree`.`idcentrocfg` = `centrocfg`.`idcentrocfg`
               LEFT JOIN     `grupo_prim` ON `grupo_prim`.`idcentrocfg` = `centrocfg`.`idcentrocfg`
               LEFT JOIN     `grupo_sec` ON `grupo_sec`.`idcentrocfg` = `centrocfg`.`idcentrocfg`
        WHERE
           (`cct`.`status` = 'A' OR cct.`status` = 'R')
               AND (`grupo_pree`.`status` = 1
               OR `grupo_prim`.`status` = 1
               OR `grupo_sec`.`status` = 1)
               AND `centrocfg`.`idcentrocfg` = $idcfg
        ORDER BY `grupo_prim`.`grado` ASC , `grupo_pree`.`grado` ASC
        , `grupo_sec`.`grado` ASC , `grupo_prim`.`grupo` ASC , `grupo_pree`.`grupo` ASC , `grupo_sec`.`grupo` ASC";
        // echo $str_query;
        // die();
        $query = $this->db->query($str_query);


        //$rows=$this->db->get()->result_array();
        //$rows=$this->db->get()->result();

        //$query = $this->db->get();
        
        return $query->result_array();
    }

    function get_grupos_personal_centrocfg($idcfg=0,$idpersonal=0) {
        $this->db->select('centrocfg.idcentrocfg,centrocfg.idct,centrocfg.turno, centrocfg.nivel,
        cct.cct,
        grupo_pree.idgrupo as preidgrupo, grupo_pree.grupo as pregrupo, grupo_pree.grado as pregrado,
        grupo_prim.idgrupo as priidgrupo, grupo_prim.grupo as prigrupo, grupo_prim.grado as prigrado,
        grupo_sec.idgrupo as secidgrupo, grupo_sec.grupo as secgrupo, grupo_sec.grado as secgrado,
        grupoxpersonal.idgrupo_pree, grupoxpersonal.idgrupo_prim, grupoxpersonal.idgrupo_sec');
        $this->db->from('centrocfg');
        $this->db->join('cct', 'cct.idct=centrocfg.idct', 'inner');
        $this->db->join('grupo_pree', 'grupo_pree.idcentrocfg = centrocfg.idcentrocfg', 'left');
        $this->db->join('grupo_prim', 'grupo_prim.idcentrocfg = centrocfg.idcentrocfg', 'left');
        $this->db->join('grupo_sec', 'grupo_sec.idcentrocfg = centrocfg.idcentrocfg', 'left');
        $this->db->join('grupoxpersonal', '(grupo_pree.idgrupo=grupoxpersonal.idgrupo_pree OR grupo_prim.idgrupo=grupoxpersonal.idgrupo_prim OR grupo_sec.idgrupo=grupoxpersonal.idgrupo_sec) AND grupoxpersonal.idpersonal='.$idpersonal, 'left');
        $this->db->where("grupo_pree.idcentrocfg IS NOT NULL OR grupo_prim.idcentrocfg IS NOT NULL OR grupo_sec.idcentrocfg IS NOT NULL
        and cct.`status`='A' and (grupo_pree.`status`=1 OR grupo_prim.`status`=1 OR grupo_sec.`status`=1) AND centrocfg.idcentrocfg=$idcfg "); // Produces: WHERE name = 'Joe'
        $this->db->order_by('grupo_prim.grado,  grupo_pree.grado, grupo_sec.grado, grupo_prim.grupo, grupo_pree.grupo, grupo_sec.grupo', 'ASC');
        $rows=$this->db->get()->result_array();
        //$query = $this->db->get();
        //echo $query;
        return $rows;
    }


    function get_pace($idcentrocfg){
        $sql = "select cf.pace from centrocfg cf "
                // " left join usuario u on u.idcentrocfg = cf.idcentrocfg"
                ." where cf.idcentrocfg = ".$idcentrocfg;

        $resultado = $this->db->query($sql)->row();

        return $resultado;
    }

    function get_nombrect($idcentrocfg){
        $sql = "SELECT
                cct.idct,cct.cct,cct.nombre,centrocfg.nivel, centrocfg.turno
                FROM centrocfg
                INNER JOIN cct ON centrocfg.idct = cct.idct
                WHERE centrocfg.idcentrocfg=" . $idcentrocfg;
        $resultado = $this->db->query($sql)->row();
        return $resultado;
    }


}
